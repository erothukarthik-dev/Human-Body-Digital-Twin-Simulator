// Analyze a medical report (text or image) with Lovable AI and return structured insights.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a clinical AI assistant. Given a patient's medical report (lab results, doctor's note, scan summary, etc.), extract clear, structured insights for the patient.
Be cautious, evidence-based, and never invent values. If something is unclear, mark it as "unclear".
Always end with a disclaimer that this is not a medical diagnosis.`;

const TOOL = {
  type: "function",
  function: {
    name: "return_report_analysis",
    description: "Return structured analysis of a medical report.",
    parameters: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "2-4 sentence plain-language summary of the report.",
        },
        overall_risk: {
          type: "string",
          enum: ["healthy", "moderate", "high"],
          description: "Overall risk level inferred from the report.",
        },
        key_findings: {
          type: "array",
          description: "Notable findings or values from the report.",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              value: { type: "string", description: "Measured value with units, or 'unclear'." },
              status: { type: "string", enum: ["normal", "borderline", "abnormal", "unclear"] },
              note: { type: "string", description: "Brief clinical context." },
            },
            required: ["label", "value", "status", "note"],
            additionalProperties: false,
          },
        },
        organ_risks: {
          type: "array",
          description: "Risk assessment for major organ systems mentioned or implied.",
          items: {
            type: "object",
            properties: {
              organ: {
                type: "string",
                enum: ["heart", "lungs", "liver", "kidneys", "brain", "other"],
              },
              level: { type: "string", enum: ["healthy", "moderate", "high"] },
              reason: { type: "string" },
            },
            required: ["organ", "level", "reason"],
            additionalProperties: false,
          },
        },
        recommendations: {
          type: "array",
          description: "Actionable, patient-friendly next steps.",
          items: { type: "string" },
        },
        red_flags: {
          type: "array",
          description: "Symptoms or values requiring urgent medical attention.",
          items: { type: "string" },
        },
        suggested_doctors: {
          type: "array",
          description: "Specialist doctors the patient should consult based on the findings. Provide 1-3 entries.",
          items: {
            type: "object",
            properties: {
              specialty: {
                type: "string",
                description: "Medical specialty, e.g. Cardiologist, Endocrinologist, Pulmonologist, Nephrologist, Hepatologist, Neurologist, General Physician.",
              },
              reason: {
                type: "string",
                description: "Why this specialist is recommended (1 sentence).",
              },
              urgency: {
                type: "string",
                enum: ["routine", "soon", "urgent"],
                description: "How soon the patient should see this doctor.",
              },
            },
            required: ["specialty", "reason", "urgency"],
            additionalProperties: false,
          },
        },
        suggested_hospitals: {
          type: "array",
          description: "Types of hospitals or clinical facilities best suited for the patient's condition. Provide 1-3 generic facility types (do not invent real hospital names unless clearly mentioned in the report).",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "Facility type, e.g. 'Multispecialty hospital with cardiology unit', 'Tertiary care center with nephrology & dialysis', 'Diabetes & endocrine clinic'.",
              },
              reason: {
                type: "string",
                description: "Why this facility type is appropriate (1 sentence).",
              },
              departments: {
                type: "array",
                description: "Key departments the patient should look for at the facility.",
                items: { type: "string" },
              },
            },
            required: ["type", "reason", "departments"],
            additionalProperties: false,
          },
        },
        disclaimer: { type: "string" },
      },
      required: [
        "summary",
        "overall_risk",
        "key_findings",
        "organ_risks",
        "recommendations",
        "red_flags",
        "suggested_doctors",
        "suggested_hospitals",
        "disclaimer",
      ],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { reportText, imageDataUrl } = await req.json().catch(() => ({}));

    if (!reportText?.trim() && !imageDataUrl) {
      return new Response(
        JSON.stringify({ error: "Provide reportText or imageDataUrl." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY missing." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userContent: any[] = [];
    if (reportText?.trim()) {
      userContent.push({
        type: "text",
        text: `Analyze this medical report and call return_report_analysis:\n\n${reportText.trim()}`,
      });
    }
    if (imageDataUrl) {
      if (userContent.length === 0) {
        userContent.push({
          type: "text",
          text: "Analyze this medical report image and call return_report_analysis.",
        });
      }
      userContent.push({ type: "image_url", image_url: { url: imageDataUrl } });
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [TOOL],
        tool_choice: { type: "function", function: { name: "return_report_analysis" } },
      }),
    });

    if (!aiRes.ok) {
      if (aiRes.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit reached. Please wait and try again." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (aiRes.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await aiRes.text();
      console.error("AI gateway error:", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const argsStr = toolCall?.function?.arguments;
    if (!argsStr) {
      console.error("No tool call returned:", JSON.stringify(data).slice(0, 500));
      return new Response(JSON.stringify({ error: "Model did not return structured output." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const analysis = JSON.parse(argsStr);
    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-report error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
