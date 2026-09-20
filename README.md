# Universal Prompt Engine v1.0 — Final Claude Project Architecture

## One rule

Every Claude Project uses exactly:

```text
1 Instructions file
+ Project Knowledge / Context files
```

The long operational prompts are stored as Project Knowledge. Users operate the system with short commands.

## Architecture

```text
                    UNIVERSAL PROMPT ENGINE
                             │
            ┌────────────────┴────────────────┐
            │                                 │
       ORIGINAL MODE                     REFERENCE MODE
            │                                 │
       DNA Builder                        DNA Analyzer
            │                                 │
            └────────────────┬────────────────┘
                             ↓
                        CHANNEL DNA
                             ↓
                      PROJECT FACTORY
                             ↓
             ┌───────────────┼───────────────┐
             ↓               ↓               ↓
        Instructions     Visual Library   Master Template
             │               │               │
             └───────────────┼───────────────┘
                             ↓
                    PRODUCTION PROJECT
                             ↓
               Topic → Story → Scenes → QA
                             ↓
                       VEO3 / Flow
                             ↓
                          CapCut
```

## Projects

### 1. DNA Engine

Instructions:

- `01_DNA_ENGINE/DNA_ENGINE_INSTRUCTIONS.md`

Knowledge:

- `dna_builder_prompt_v1.md`
- `dna_analysis_prompt_v1.md`
- `channel_dna_schema_v1.yaml`

### 2. Project Factory

Instructions:

- `02_PROJECT_FACTORY/PROJECT_FACTORY_INSTRUCTIONS.md`

Knowledge:

- `00_CORE/universal_instruction_v1.md`
- `00_CORE/characters_library_template_v1.js`
- `00_CORE/master_template_universal_v1.js`
- `02_PROJECT_FACTORY/project_rebuilder_prompt_v1.md`
- `03_QA/content_integrity_v1.md`
- channel-specific DNA and references

### 3. Production Project

Instructions:

- generated `project_instructions.md`

Knowledge:

- generated visual/entity library JS
- generated master template JS
- `CHANNEL_DNA.yaml`
- `PROJECT_MANIFEST.md`
- optional approved reference/research files

## Modes

### Original Mode

Use when the creator invents the channel from first principles. The user only needs to describe the idea simply. The DNA Builder expands it using the full framework in Project Knowledge.

### Reference Mode

Use when the creator supplies existing channels/videos as research references. The Analyzer extracts abstract structural patterns only and produces an original Channel DNA.

Reference Mode is optional; it is not a dependency.

## Visual library modes

The system supports:

- `NONE` — no recurring character; use visual entities/subjects/locations.
- `FIXED_CAST` — recurring characters with locked canonical specifications.
- `FLEXIBLE_CAST` — episode-local characters with consistency locks.

## DNA layers

1. Universal Engine DNA — reusable production methodology.
2. Channel DNA — channel-specific identity and rules.
3. Video/Scene DNA — episode-specific execution at runtime.

The Production Project should not hard-wire one episode into its permanent configuration.

## Short-command principle

Users should not paste the framework repeatedly. Examples:

```text
Original Mode. I want to build a documentary channel about hidden infrastructure.

Reference Mode. Build an original channel around [goal] from the references I provide.

Build the production project.

Give me 10 topic ideas.

Develop this topic and stop after the Story Identity Card.

Approved. Continue.

Generate Scene 1.

Audit the episode.
```

## Scope note

This package is a generalized production architecture. It is not a byte-for-byte reconstruction of any private/original project source.
