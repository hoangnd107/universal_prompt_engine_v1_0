# Universal Prompt Engine v1.0 — Claude Project Setup

## Core rule

Every Claude Project uses:

```text
1 Instructions file
+
Project Knowledge / Context files
```

Do not put multiple long prompt files into the Instructions field.

---

# PROJECT 1 — DNA ENGINE

### Instructions

Upload/set exactly ONE file as Instructions:

`01_DNA_ENGINE/DNA_ENGINE_INSTRUCTIONS.md`

### Project Knowledge

Upload:

```text
01_DNA_ENGINE/dna_builder_prompt_v1.md
01_DNA_ENGINE/dna_analysis_prompt_v1.md
01_DNA_ENGINE/channel_dna_schema_v1.yaml
```

Optional: keep the two short user-command examples outside the Project for copy/paste.

### Original Mode

Send only:

> Original Mode. I want to build a channel about [simple description].

Then add any constraints you already know.

Claude reads the full DNA Builder from Project Knowledge.

Output:

- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`

### Reference Mode

Send only:

> Reference Mode. Build an original channel in the direction of [simple goal] from the references I provide.

Then provide/upload the reference material.

Claude reads the full DNA Analyzer from Project Knowledge.

Output:

- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`
- `REFERENCE_NOTES.md`

---

# PROJECT 2 — PROJECT FACTORY

### Instructions

Upload/set exactly ONE file as Instructions:

`02_PROJECT_FACTORY/PROJECT_FACTORY_INSTRUCTIONS.md`

### Project Knowledge

Upload:

```text
00_CORE/universal_instruction_v1.md
00_CORE/characters_library_template_v1.js
00_CORE/master_template_universal_v1.js
03_QA/content_integrity_v1.md
02_PROJECT_FACTORY/project_rebuilder_prompt_v1.md
```

Then upload the selected channel inputs:

```text
CHANNEL_DNA.md
CHANNEL_DNA.yaml
```

Optional:

```text
character reference images
visual/entity/world reference images
creator notes
```

### User command

> Build the production project from the CHANNEL DNA in this Project.

Optional:

> Project name: Hidden Systems Documentary. No recurring human characters. Use visual entities.

Output exactly:

```text
project_instructions.md
characters_<project>_v1.0.js
<project>_master_template_v1.0.js
PROJECT_MANIFEST.md
```

---

# PROJECT 3 — PRODUCTION PROJECT

Create one Claude Project per finished YouTube channel.

Example:

`YT — Hidden Systems Documentary`

### Instructions

Use exactly ONE file:

`project_instructions.md`

This is the channel-specific runtime brain compiled by the Factory.

### Project Knowledge

Upload:

```text
characters_<project>_v1.0.js
<project>_master_template_v1.0.js
CHANNEL_DNA.yaml
PROJECT_MANIFEST.md
```

Optional:

```text
approved visual/entity reference assets
approved research documents
channel-specific supporting material
```

Do NOT upload the DNA Builder, DNA Analyzer, or Project Factory prompts here.

### Daily usage

Use short commands:

> Give me 10 original topic ideas.

> Develop this topic: [topic]. Start with the Story Identity Card only. Stop for approval.

> Approved. Continue.

> Build the act structure.

> Generate Act 1.

> Generate Scene 1.

> Audit the episode.

The long production rules already live in the Project Instructions and Project Knowledge.

---

# FINAL DATA FLOW

```text
ORIGINAL MODE ─┐
               ├→ CHANNEL DNA ─→ PROJECT FACTORY ─→ PRODUCTION PROJECT
REFERENCE MODE ┘
```

And inside the Production Project:

```text
Topic → Story → Approval → Acts → Scenes → Screenplay Metadata + VEO3 Prompt → QA
```
