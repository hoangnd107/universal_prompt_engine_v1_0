/**
 * UNIVERSAL YOUTUBE PROMPT ENGINE v1.0
 * MASTER PRODUCTION TEMPLATE
 *
 * Dual-mode support:
 * - Character-driven channels
 * - Subject/entity-driven channels with no recurring cast
 *
 * Channel DNA controls project-specific values; this file controls the
 * reusable production contract and renderer.
 */

const LIB = require("./characters_library_template_v1.js");

const CHAR_LIST = LIB.CHARACTERS || [];
const CHAR = LIB.CHAR || Object.create(null);
const STYLE = LIB.STYLE || { lock: "" };
const THUMBNAIL_CONFIG = LIB.THUMBNAIL_CONFIG || {
	width: 1707,
	height: 282,
	dimensions: "1707x282",
	aspect_ratio: "1707:282",
	prompt_rule:
		"Generate the thumbnail on an exact 1707x282 canvas. Do not crop, pad, resize, or change the aspect ratio.",
};

const PROJECT = {
	channel_name: "[CHANNEL NAME]",
	content_type: "[CONTENT TYPE]",
	core_promise: "[CORE PROMISE]",
	target_audience: "[TARGET AUDIENCE]",
	visual_style: "[VISUAL DNA]",
	visual_mode: LIB.PROJECT_VISUAL_MODE || "NONE",
	story_format: "[STORY FORMAT]",
	output_tool: "[OUTPUT TOOL]",
	narration_mode: "[NARRATION MODE]",
	language_register: "[LANGUAGE / REGISTER]",
	title: "STORY TITLE",
	youtube_title: "YOUTUBE TITLE",
	central_question: "CENTRAL VIEWER QUESTION",
	duration_minutes: 10,
	scene_duration_seconds: 8,
	estimated_scenes: null,
	content_pillar: "CONTENT PILLAR",
	story_premise: "STORY PREMISE",
	hook_type: "HOOK TYPE",
	terminology_focus: [],
	emotional_or_analytical_arc: "ARC",
	leitmotif: {
		enabled: false,
		name: "",
		C1: "",
		C2: "",
		C3: "",
	},
	circular_callback: {
		enabled: false,
		opening_state: "",
		transformation: "",
		ending_state: "",
	},
};

const CONTENT_RULES = {
	maxDialogueWordsPerLine: null,
	maxDialogueTurnsPerScene: null,
	contractionsAllowed: null,
	subtitlesRequired: false,
	subtitleExactMatch: false,
	sceneDurationSeconds: PROJECT.scene_duration_seconds,
};

const STORY_ENGINE = [
	"NORMAL LIFE",
	"HOOK",
	"PROBLEM",
	"ESCALATION",
	"ATTEMPT TO SOLVE",
	"COMPLICATION",
	"DISCOVERY / TURN",
	"SOLUTION",
	"EMOTIONAL PAYOFF",
	"RETURN TO LIFE",
];

const STORY_PRIMITIVES = {
	tenStepEnabled: true,
	circularStorytelling: PROJECT.circular_callback.enabled
		? "required"
		: "optional",
	leitmotif: PROJECT.leitmotif.enabled ? "enabled" : "optional",
};

const VEO3_SECTIONS = [
	"Duration",
	"VISUAL STYLE",
	"CHARACTERS / VISUAL ENTITIES IN THIS SCENE",
	"SHOT",
	"LIGHTING",
	"SCENE BREAKDOWN",
	"DIALOGUE LIP SYNC",
	"CAMERA",
	"AUDIO",
	"RENDER LOCK",
];

function countWords(text) {
	if (typeof text !== "string") return 0;
	const cleaned = text.trim();
	return cleaned ? cleaned.split(/\s+/).filter(Boolean).length : 0;
}

function normalizeEntityIds(entities) {
	if (Array.isArray(entities))
		return entities
			.map(String)
			.map((x) => x.trim())
			.filter(Boolean);
	if (typeof entities === "string") {
		return entities
			.split(/[·,|+]/)
			.map((part) => part.trim())
			.filter(Boolean);
	}
	return [];
}

function getEntity(id) {
	const entity = CHAR[id];
	if (!entity) throw new Error(`Unknown character/entity id: ${id}`);
	return entity;
}

function buildEntityDisplay(ids) {
	return ids
		.map((id) => {
			const e = getEntity(id);
			return `${e.emoji ? `${e.emoji} ` : ""}${e.name || id}`.trim();
		})
		.join(" · ");
}

function buildEntityPrompt(ids) {
	if (!ids.length)
		return "[No recurring character or canonical visual entity is used in this scene.]";
	return ids
		.map((id) => {
			const entity = getEntity(id);
			return (
				entity.reference_prompt ||
				entity.description ||
				`[No canonical reference prompt supplied for ${id}]`
			);
		})
		.join("\n\n");
}

function validateDialogue(dialogues) {
	const errors = [];
	if (!Array.isArray(dialogues)) return ["dialogues must be an array."];
	if (
		Number.isInteger(CONTENT_RULES.maxDialogueTurnsPerScene) &&
		dialogues.length > CONTENT_RULES.maxDialogueTurnsPerScene
	) {
		errors.push(
			`Maximum ${CONTENT_RULES.maxDialogueTurnsPerScene} dialogue turns per scene; received ${dialogues.length}.`,
		);
	}
	dialogues.forEach((entry, index) => {
		if (!entry || typeof entry !== "object")
			return errors.push(`Dialogue ${index + 1} must be an object.`);
		if (!entry.char || !CHAR[entry.char])
			errors.push(
				`Dialogue ${index + 1} uses unknown character: ${entry.char}`,
			);
		if (typeof entry.line !== "string" || !entry.line.trim())
			errors.push(`Dialogue ${index + 1} must contain a non-empty line.`);
		if (
			entry.line &&
			Number.isInteger(CONTENT_RULES.maxDialogueWordsPerLine) &&
			countWords(entry.line) > CONTENT_RULES.maxDialogueWordsPerLine
		) {
			errors.push(`Dialogue ${index + 1} exceeds the configured word limit.`);
		}
		if (
			entry.line &&
			CONTENT_RULES.contractionsAllowed === false &&
			/\b\w+'\w+\b/.test(entry.line)
		) {
			errors.push(`Dialogue ${index + 1} contains a contraction.`);
		}
	});
	return errors;
}

function validateSubtitleExactMatch(dialogues, subtitleText) {
	if (!Array.isArray(subtitleText)) return ["subtitle_text must be an array."];
	if (dialogues.length !== subtitleText.length)
		return ["Dialogue and subtitle counts must match."];
	return dialogues.flatMap((entry, i) =>
		entry.line === subtitleText[i]
			? []
			: [`Subtitle mismatch at line ${i + 1}.`],
	);
}

function validateScene(scene) {
	const errors = [];
	if (!scene || typeof scene !== "object") return ["Scene must be an object."];
	["act", "num", "time", "title", "desc", "note"].forEach((f) => {
		if (scene[f] === undefined || scene[f] === null)
			errors.push(`Missing required scene field: ${f}`);
	});
	const ids = normalizeEntityIds(scene.entities ?? scene.chars ?? []);
	ids.forEach((id) => {
		if (!CHAR[id]) errors.push(`Unknown character/entity id: ${id}`);
	});
	const dialogues = scene.dialogues ?? [];
	errors.push(...validateDialogue(dialogues));
	if (CONTENT_RULES.subtitleExactMatch && dialogues.length) {
		errors.push(...validateSubtitleExactMatch(dialogues, scene.subtitle_text));
	}
	return errors;
}

function renderScreenplayMetadata(scene) {
	const errors = validateScene(scene);
	if (errors.length)
		throw new Error(
			`Scene ${scene?.num ?? "?"} validation failed:\n- ${errors.join("\n- ")}`,
		);
	const ids = normalizeEntityIds(scene.entities ?? scene.chars ?? []);
	const dialogues = (scene.dialogues ?? [])
		.map(
			(d) =>
				`    { char: ${JSON.stringify(d.char)}, line: ${JSON.stringify(d.line)} },`,
		)
		.join("\n");
	const subtitles = Array.isArray(scene.subtitle_text)
		? scene.subtitle_text.map((s) => `    ${JSON.stringify(s)},`).join("\n")
		: "";
	return [
		"PART 1: SCREENPLAY METADATA",
		"```javascript",
		`const SCENE_${Number(scene.num)}_METADATA = {`,
		`  act: ${Number(scene.act)},`,
		`  num: ${Number(scene.num)},`,
		`  time: ${JSON.stringify(scene.time)},`,
		`  title: ${JSON.stringify(String(scene.title).toUpperCase())},`,
		`  chars: ${JSON.stringify(buildEntityDisplay(ids))},`,
		`  entities: ${JSON.stringify(ids)},`,
		`  desc: ${JSON.stringify(scene.desc)},`,
		`  terminology_focus: ${JSON.stringify(scene.terminology_focus ?? scene.vocabulary_focus ?? "")},`,
		"  dialogues: [",
		dialogues,
		"  ],",
		"  subtitle_text: [",
		subtitles,
		"  ],",
		`  note: ${JSON.stringify(scene.note)},`,
		"};",
		"```",
	].join("\n");
}

function renderDialogueLipSync(scene) {
	const dialogues = scene.dialogues || [];
	if (!dialogues.length) return "No dialogue in this scene.";
	if (Array.isArray(scene.dialogue_timing)) {
		return scene.dialogue_timing
			.map((t) => {
				const d = dialogues[t.dialogue_index];
				if (!d) throw new Error(`Invalid dialogue_index: ${t.dialogue_index}`);
				return `Second ${t.second}: ${d.char} says: "${d.line}"`;
			})
			.join("\n");
	}
	return dialogues
		.map((d) => `[TIMESTAMP]: ${d.char} says: "${d.line}"`)
		.join("\n");
}

function renderSceneBreakdown(scene) {
	if (!scene.scene_breakdown || typeof scene.scene_breakdown !== "object") {
		return `[Build a complete timeline for ${scene.duration_seconds || PROJECT.scene_duration_seconds} seconds.]`;
	}
	return Object.entries(scene.scene_breakdown)
		.map(([range, description]) => `Seconds ${range}: ${description}`)
		.join("\n");
}

function renderVeo3Prompt(scene) {
	const errors = validateScene(scene);
	if (errors.length)
		throw new Error(
			`Scene ${scene?.num ?? "?"} validation failed:\n- ${errors.join("\n- ")}`,
		);
	const ids = normalizeEntityIds(scene.entities ?? scene.chars ?? []);
	const lighting = scene.lighting || {};
	const camera = scene.camera || {};
	const audio = scene.audio || {};
	const lock = scene.render_lock || {};
	const duration = scene.duration_seconds || PROJECT.scene_duration_seconds;
	return [
		`Duration: ${duration} seconds.`,
		"",
		"VISUAL STYLE:",
		scene.visual_style || STYLE.lock || PROJECT.visual_style,
		"",
		"CHARACTERS / VISUAL ENTITIES IN THIS SCENE:",
		buildEntityPrompt(ids),
		"",
		"---- SHOT ----",
		scene.shot || "[Shot description]",
		"",
		"---- LIGHTING ----",
		`Primary light: ${lighting.primary || "[Primary lighting]"}`,
		`Fill light: ${lighting.fill || "[Fill lighting]"}`,
		`Environment: ${lighting.environment || "[Environment lighting]"}`,
		"",
		"---- SCENE BREAKDOWN ----",
		renderSceneBreakdown(scene),
		"",
		"---- DIALOGUE LIP SYNC ----",
		renderDialogueLipSync(scene),
		"",
		"---- CAMERA ----",
		`Movement: ${camera.movement || "[Camera movement]"}`,
		`Start: ${camera.start || "[Opening frame]"}`,
		`End: ${camera.end || "[Closing frame]"}`,
		"",
		"---- AUDIO ----",
		`Music: ${audio.music || "[Music policy]"}`,
		`Ambient: ${audio.ambient || "[Ambient sound]"}`,
		`Narration: ${audio.narration || "[Narration guidance]"}`,
		"",
		"---- RENDER LOCK ----",
		lock.base ||
			"Preserve the compiled visual DNA and canonical identity attributes.",
		`Characters / entities: ${lock.entities || "Preserve all canonical entity attributes."}`,
		`Background: ${lock.background || "Maintain continuity with the established environment."}`,
		lock.negative ||
			"NO contradictory style drift. NO invented identity changes. NO unsupported factual visual meaning.",
	].join("\n");
}

function buildThumbnailPrompt({
	concept = "",
	text = "",
	visual_direction = "",
} = {}) {
	return [
		"THUMBNAIL IMAGE PROMPT:",
		`Canvas dimensions: ${THUMBNAIL_CONFIG.dimensions} pixels (width ${THUMBNAIL_CONFIG.width}, height ${THUMBNAIL_CONFIG.height}).`,
		`Aspect ratio: ${THUMBNAIL_CONFIG.aspect_ratio}.`,
		THUMBNAIL_CONFIG.prompt_rule,
		`Concept: ${concept || "[Thumbnail concept]"}`,
		`Text: ${text || "[Thumbnail text, if any]"}`,
		`Visual direction: ${visual_direction || STYLE.thumbnail_tag || "[Thumbnail visual direction]"}`,
	].join("\n");
}

function renderScene(scene) {
	return [
		`SCENE ${scene.num}`,
		"",
		renderScreenplayMetadata(scene),
		"",
		"PART 2: VEO3 PROMPT",
		"",
		renderVeo3Prompt(scene),
	].join("\n");
}

const WORKFLOW = {
	step1_identity: { name: "STORY / VIDEO IDENTITY", approval_required: true },
	step2_premise: { name: "PREMISE + NARRATIVE PLAN", approval_required: true },
	step3_acts: {
		name: "ACT STRUCTURE",
		approval_required: true,
		one_act_at_a_time: true,
	},
	step4_scenes: { name: "SCENE PRODUCTION", approval_required: false },
	step5_qa: { name: "QA", required_before_export: true },
	step6_export: { name: "EXPORT", explicit_user_command_required: true },
};

const QA_CHECKLIST = {
	channel: [
		"Channel identity matches compiled Channel DNA.",
		"No obsolete project identity has leaked into the episode.",
	],
	story: [
		"Hook is clear and relevant to the viewer promise.",
		"Narrative progression is coherent.",
		"Every scene has a function.",
		"The ending resolves or intentionally reframes the central question.",
	],
	originality: [
		"No copied scripts or distinctive phrasing.",
		"No one-to-one recreation of reference creative execution.",
		"No invented source attribution.",
	],
	factuality: [
		"Claims are classified by confidence type.",
		"Numbers preserve date, unit, population, and context.",
		"Forecasts and estimates are labeled.",
		"Visuals do not imply unsupported factual meaning.",
	],
	consistency: [
		"Canonical characters/entities remain visually consistent.",
		"Recurring environments remain consistent.",
		"Camera logic is coherent.",
	],
	export: [
		"Screenplay Metadata and VEO3 Prompt are separate.",
		"VEO3 Prompt is copy-paste ready plain text.",
		"No unresolved placeholders remain.",
	],
};

const QUICK_COMMANDS = {
	buildTopics:
		"Generate original topics aligned to Channel DNA topic architecture.",
	developTopic:
		"Start the approval-gated planning flow for one selected topic.",
	writeAct: "Write only the approved act currently being produced.",
	writeScene: "Generate one complete scene with metadata and VEO3 prompt.",
	copyVeoPrompt: "Return only the VEO3 Prompt for the selected scene.",
	audit:
		"Run channel, story, originality, factuality, consistency, and export QA.",
};

module.exports = {
	PROJECT,
	CHARACTERS: CHAR_LIST,
	CHAR,
	STYLE,
	THUMBNAIL_CONFIG,
	CONTENT_RULES,
	STORY_ENGINE,
	STORY_PRIMITIVES,
	VEO3_SECTIONS,
	WORKFLOW,
	QA_CHECKLIST,
	QUICK_COMMANDS,
	countWords,
	normalizeEntityIds,
	getEntity,
	buildEntityDisplay,
	buildEntityPrompt,
	validateDialogue,
	validateSubtitleExactMatch,
	validateScene,
	renderScreenplayMetadata,
	renderVeo3Prompt,
	buildThumbnailPrompt,
	renderScene,
};
