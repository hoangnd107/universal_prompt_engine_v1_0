# Universal Prompt Engine v1 — Exact Setup

## Principle

The long prompts are system/context prompts. The user should normally send only short operational prompts.

There are three separate Claude Projects:

1. DNA Builder / Analyzer
2. Project Factory
3. Channel Production

Do not put all three workflows into one production Project.

---

## PROJECT 1 — DNA ENGINE

Create a Claude Project for the DNA stage.

### Project Instructions

For Original Mode, load:

- `01_DNA_ENGINE/dna_builder_prompt_v1.md`
- `01_DNA_ENGINE/channel_dna_schema_v1.yaml` (as project knowledge if the interface does not accept YAML directly in instructions)

For Reference Mode, load:

- `01_DNA_ENGINE/dna_analysis_prompt_v1.md`
- `01_DNA_ENGINE/channel_dna_schema_v1.yaml`

If you want one reusable DNA Project, load both long prompts and tell the Project that the user will explicitly say `Original Mode` or `Reference Mode`.

### User prompt — Original Mode

Use the short prompt from:
`01_DNA_ENGINE/ORIGINAL_MODE_USER_PROMPT.md`

Then add only your own channel description.

Example:
"I want a premium English-language faceless documentary channel explaining hidden infrastructure, engineering, logistics and technology systems that make modern life work. Calm, intelligent, cinematic, evidence-driven. I will use AI-generated visuals and CapCut."

The Project should ask only for missing information that materially affects the DNA. It should then produce:

- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`

### User prompt — Reference Mode

Use:
`01_DNA_ENGINE/REFERENCE_MODE_USER_PROMPT.md`

Then attach/provide the reference materials and briefly state your own channel goal.

The Project should produce:

- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`
- `REFERENCE_NOTES.md`

---

## PROJECT 2 — PROJECT FACTORY

Create a separate Claude Project named something like:
`YT Project Factory`

### Project Instructions

Load:

- `02_PROJECT_FACTORY/project_rebuilder_prompt_v1.md`

### Project Knowledge

Load the Universal Core files:

- `00_CORE/universal_instruction_v1.md`
- `00_CORE/characters_library_template_v1.js`
- `00_CORE/master_template_universal_v1.js`
- `03_QA/content_integrity_v1.md`

Then provide the channel-specific inputs:

- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`
- character reference images if the channel uses FIXED_CAST
- visual/entity reference images if needed
- any creator-specific notes

### User prompt

Use:
`02_PROJECT_FACTORY/PROJECT_FACTORY_SIMPLE_PROMPT.md`

The Factory should generate exactly:

1. `project_instructions.md`
2. `characters_<project>_v1.0.js`
3. `<project>_master_template_v1.0.js`
4. `PROJECT_MANIFEST.md`

These four files become the configuration package for the production channel.

---

## PROJECT 3 — CHANNEL PRODUCTION

Create one Claude Project per actual YouTube channel.

Example:
`YT — Hidden Systems Documentary`

### Project Instructions

Use the generated:
`project_instructions.md`

Do not use the generic DNA Builder or Project Factory prompt here.

### Project Knowledge

Load:

- `characters_<project>_v1.0.js`
- `<project>_master_template_v1.0.js`
- `CHANNEL_DNA.yaml` (optional but recommended)
- `PROJECT_MANIFEST.md` (recommended)

If the channel uses visual/entity references, also load the approved reference assets.

### Production usage

Now the user can use very short prompts.

Examples:

"Give me 10 original topic ideas."

"Develop this topic: The Ships That Repair the Internet. Start with the Story Identity Card only. Stop for approval."

"Approved. Continue to the premise."

"Approved. Build the act structure."

"Approved. Generate Act 1 scenes."

"Generate Scene 1 in the required Screenplay Metadata + VEO3 Prompt format."

"Audit Scenes 1–10 for visual, narrative and factual consistency."

The Project Instructions contain the detailed workflow, so the user does not need to repeat it.

---

## RECOMMENDED FILE FLOW

```text
Universal Prompt Engine
│
├── DNA ENGINE
│   ├── Original Mode
│   │   └── CHANNEL_DNA
│   └── Reference Mode
│       └── CHANNEL_DNA
│
├── PROJECT FACTORY
│   └── 4 project artifacts
│
└── PRODUCTION PROJECT
    └── Topic → Story → Scenes → VEO3 → QA
```

## IMPORTANT

The short user prompts are intentionally short. They work because the long operational prompts are already loaded into the relevant Claude Project as instructions/context.

Do not paste the entire framework again in every chat.

If a new Claude Project does not have the relevant long instruction loaded, the short prompt alone is not sufficient.
