# CLAUDE PROJECT FILE MAP v1.0

## DNA Engine

### Instructions — exactly one

- `01_DNA_ENGINE/DNA_ENGINE_INSTRUCTIONS.md`

### Project Knowledge

- `01_DNA_ENGINE/dna_builder_prompt_v1.md`
- `01_DNA_ENGINE/dna_analysis_prompt_v1.md`
- `01_DNA_ENGINE/channel_dna_schema_v1.yaml`

## Project Factory

### Instructions — exactly one

- `02_PROJECT_FACTORY/PROJECT_FACTORY_INSTRUCTIONS.md`

### Project Knowledge

- `00_CORE/universal_instruction_v1.md`
- `00_CORE/characters_library_template_v1.js`
- `00_CORE/master_template_universal_v1.js`
- `02_PROJECT_FACTORY/project_rebuilder_prompt_v1.md`
- `03_QA/content_integrity_v1.md`
- `CHANNEL_DNA.md`
- `CHANNEL_DNA.yaml`
- optional reference images/material

## Production Project

### Instructions — exactly one

- generated `project_instructions.md`

### Project Knowledge

- generated `characters_<project>_v1.0.js`
- generated `<project>_master_template_v1.0.js`
- `CHANNEL_DNA.yaml`
- `PROJECT_MANIFEST.md`
- optional approved visual/entity references
- optional approved research files

## Never put these into Production Instructions

- DNA Builder prompt
- DNA Analyzer prompt
- Project Factory prompt
- generic universal framework files that are not needed at runtime
