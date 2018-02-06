_iceFramework.config._defaults = {
	// Canvas settings
	width: 800,
	height: 600,
	border_color: colors.BLACK,
	border_thickness: "4px",
	border_style: "solid",

	// Drawing settings
	color_mode: RGB,
	background_color: colors.WHITE,
	fill: colors.SILVER,
	stroke: colors.BLACK,
	stroke_width: 2,
	stroke_pattern: [],

	// Tick settings
	loop: true,
	fps: 60,
	fpsSmoothing: 0.99
}
for(let key in _iceFramework.config._defaults) {
	if(_iceFramework.config[key] === undefined) {
		_iceFramework.config[key] = _iceFramework.config._defaults[key];
	}
}

canvas.style.borderColor = _iceFramework.config.border_color;
canvas.style.borderWidth = typeof _iceFramework.config.border_thickness === "number" ? _iceFramework.config.border_thickness + "px" : _iceFramework.config.border_thickness;
canvas.style.borderStyle = _iceFramework.config.border_style;

resize(_iceFramework.config.width, _iceFramework.config.height);
fill(_iceFramework.config.fill);
stroke(_iceFramework.config.stroke);
lineWidth(_iceFramework.config.stroke_width);
strokePattern(_iceFramework.config.stroke_pattern);
font(_iceFramework.config.font_size, _iceFramework.config.font_family);
textAlign(_iceFramework.config.text_baseline, _iceFramework.config.text_align);
setBackground(_iceFramework.config.background_color);
colorMode(_iceFramework.config.color_mode);

/*
 *	Utils
 */

_iceFramework.imgMem = {};
