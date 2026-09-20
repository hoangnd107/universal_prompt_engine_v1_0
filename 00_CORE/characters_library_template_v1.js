/**
 * UNIVERSAL YOUTUBE PROMPT ENGINE v1.0
 * CHARACTER / VISUAL ENTITY LIBRARY TEMPLATE
 *
 * This file is intentionally dual-mode:
 * - FIXED_CAST / FLEXIBLE_CAST projects may define recurring characters.
 * - NONE projects may define canonical visual entities, subjects, props, vehicles,
 *   locations, diagrams, or other continuity-critical objects instead.
 */

const STYLE_LOCK = "[COMPILED PROJECT VISUAL DNA]";

const PROJECT_VISUAL_MODE = "NONE"; // NONE | FIXED_CAST | FLEXIBLE_CAST

const MAIN_CHARACTERS = [];

const SUPPORTING_CHARACTERS = [];

const VISUAL_ENTITIES = [
	// Example:
	// {
	//   id: 'ENTITY_ID',
	//   name: 'Entity Name',
	//   type: 'vehicle | machine | location | object | system | subject',
	//   role: 'Why this entity matters',
	//   canonical_attributes: ['attribute 1', 'attribute 2'],
	//   reference_prompt: `FULL canonical visual specification`,
	// }
];

const ENVIRONMENTS = [
	// {
	//   id: 'ENV_ID',
	//   name: 'Environment Name',
	//   description: 'Full continuity description',
	//   reference_prompt: `FULL environment specification`,
	// }
];

const CHARACTER_SYSTEM = {
	mode: PROJECT_VISUAL_MODE,
	appearance_lock:
		"Do not alter canonical identity attributes unless the scene explicitly calls for a temporary state change.",
	dialogue_required: false,
};

const ALL_ENTITIES = [
	...MAIN_CHARACTERS,
	...SUPPORTING_CHARACTERS,
	...VISUAL_ENTITIES,
];

const CHARACTERS = ALL_ENTITIES;

const CHAR = Object.create(null);
ALL_ENTITIES.forEach((entity) => {
	if (entity && entity.id) CHAR[entity.id] = entity;
});

const STYLE = {
	lock: STYLE_LOCK,
	tag: "[STYLE TAG]",
	thumbnail_tag: "[THUMBNAIL STYLE TAG]",
};

const THUMBNAIL_CONFIG = {
	width: 1707,
	height: 282,
	dimensions: "1707x282",
	aspect_ratio: "1707:282",
	prompt_rule:
		"Generate the thumbnail on an exact 1707x282 canvas. Do not crop, pad, resize, or change the aspect ratio.",
};

module.exports = {
	PROJECT_VISUAL_MODE,
	CHARACTER_SYSTEM,
	MAIN_CHARACTERS,
	SUPPORTING_CHARACTERS,
	VISUAL_ENTITIES,
	ENVIRONMENTS,
	CHARACTERS,
	CHAR,
	STYLE,
	THUMBNAIL_CONFIG,
};
