/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/SpriteAtlas.js":
/*!***************************************!*\
  !*** ./src/components/SpriteAtlas.js ***!
  \***************************************/
/***/ (() => {

// // Taken from https://github.com/mrdoob/three.js/issues/758
// function _GetImageData(image) {
// 	var canvas = document.createElement("canvas");
// 	canvas.width = image.width;
// 	canvas.height = image.height;

// 	var context = canvas.getContext("2d");
// 	context.drawImage(image, 0, 0);

// 	return context.getImageData(0, 0, image.width, image.height);
// }

// class SpriteAtlas {
// 	constructor() {}
// }

// AFRAME.registerComponent("test", {
//   init: function () {
//     const fl = document.querySelector("a-assets").fileLoader;
    
// 		console.log(fl);
// 	},
// });


/***/ }),

/***/ "./src/components/helpers.js":
/*!***********************************!*\
  !*** ./src/components/helpers.js ***!
  \***********************************/
/***/ (() => {

AFRAME.registerComponent("gizmo", {
	dependency: ["arrow", "axis"],
	schema: {
		size: { type: "int", default: 10 },
		divisions: { type: "int", default: 10 },
		colorCenterLine: { type: "color", default: "#444444" },
		colorGrid: { type: "color", default: "#888888" },
		xAxisColor: { type: "color", default: "red" },
		yAxisColor: { type: "color", default: "green" },
		zAxisColor: { type: "color", default: "blue" },
	},
	init: function () {
		var data = this.data;
		const scene = this.el;

		// generating main axis lines
		const gizmo = document.createElement("a-entity");
		const axis = document.createElement("a-entity");
		axis.setAttribute("axis", "size", data.size);
		axis.setAttribute("axis", "xAxisColor", data.xAxisColor);
		axis.setAttribute("axis", "yAxisColor", data.yAxisColor);
		axis.setAttribute("axis", "zAxisColor", data.zAxisColor);

		// generating grid lines
		const grid = document.createElement("a-entity");
		grid.setAttribute("position", { x: data.size / 2, y: 0, z: data.size / 2 });
		grid.setAttribute("grid", "size", data.size);
		grid.setAttribute("grid", "divisions", data.divisions);
		grid.setAttribute("grid", "colorCenterLine", data.colorCenterLine);
		grid.setAttribute("grid", "colorGrid", data.colorGrid);

		gizmo.appendChild(grid);
		gizmo.appendChild(axis);
		scene.appendChild(gizmo);
	},
	update: function () {},
	tick: function () {},
	remove: function () {},
	pause: function () {},
	play: function () {},
});

AFRAME.registerComponent("arrow", {
	schema: {
		dir: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
		origin: { type: "vec3", default: { x: 0, y: 0, z: 0 } },
		length: { type: "number", default: 1 },
		color: { type: "color", default: "#74BEC1" },
		opacity: { type: "number", default: 1 },
		visible: { default: true },
		headlength: { type: "number", default: 0 },
		headwidth: { type: "number", default: 0 },
	},

	multiple: true,

	init: function () {
		var data = this.data;
		this.arrow = new THREE.ArrowHelper(
			new THREE.Vector3(data.dir.x, data.dir.y, data.dir.z).normalize(),
			new THREE.Vector3(data.origin.x, data.origin.y, data.origin.z),
			data.length,
			data.color,
			data.headlength === 0 ? undefined : data.headlength,
			data.headwidth === 0 ? undefined : data.headwidth
		);

		this.el.setObject3D(this.attrName, this.arrow);
	},
	update: function (oldData) {
		var data = this.data;

		if (data.color !== oldData.color) this.arrow.setColor(data.color);

		if (!isEqualVec3(data.dir, oldData.dir))
			this.arrow.setDirection(new THREE.Vector3(data.dir.x, data.dir.y, data.dir.z).normalize());
		console.log(data.origin, oldData.origin);
		if (!isEqualVec3(data.origin, oldData.origin)) {
			this.arrow.position.x = data.origin.x;
			this.arrow.position.y = data.origin.y;
			this.arrow.position.z = data.origin.z;
		}
	},
	remove: function () {
		this.el.removeObject3D("arrow", this.arrow);
	},
});

AFRAME.registerComponent("grid", {
	schema: {
		size: { type: "int", default: 10 },
		divisions: { type: "int", default: 10 },
		colorCenterLine: { type: "color", default: "#444444" },
		colorGrid: { type: "color", default: "#888888" },
	},
	multiple: true,
	init: function () {
		var data = this.data;
		this.grid = new THREE.GridHelper(
			data.size,
			data.divisions,
			data.colorCenterLine,
			data.colorGrid
		);

		this.el.setObject3D(this.attrName, this.grid);
	},
	update: function (oldData) {
		var data = this.data;

		// update size
		// update divisions
		// update colorCenterLine
		// update colorGrid
		if (
			data.size !== oldData.size ||
			data.divisions !== oldData.divisions ||
			data.colorCenterLine !== oldData.colorCenterLine ||
			data.colorGrid !== oldData.colorGrid
		) {
			this.el.removeObject3D("grid", this.grid);
			this.grid = new THREE.GridHelper(
				data.size,
				data.divisions,
				data.colorCenterLine,
				data.colorGrid
			);
			this.el.setObject3D(this.attrName, this.grid);
		}
	},
	remove: function () {
		this.el.removeObject3D("grid", this.grid);
	},
});

AFRAME.registerComponent("axis", {
	schema: {
		size: { type: "int", default: 1 },
		xAxisColor: { type: "color", default: "red" },
		yAxisColor: { type: "color", default: "green" },
		zAxisColor: { type: "color", default: "blue" },
	},
	multiple: true,
	init: function () {
		var data = this.data;
		this.axis = new THREE.AxesHelper(data.size);

		this.axis.setColors(data.xAxisColor, data.yAxisColor, data.zAxisColor);
		this.el.setObject3D(this.attrName, this.axis);
	},
	update: function (oldData) {
		var data = this.data;

		//updating colors
		if (
			data.xAxisColor !== oldData.xAxisColor ||
			data.yAxisColor !== oldData.yAxisColor ||
			data.zAxisColor !== oldData.zAxisColor
		) {
			this.axis.setColors(data.xAxisColor, data.yAxisColor, data.zAxisColor);
		}

		// updating size
		if (data.size !== oldData.size) {
			this.axis.dispose();
			this.el.removeObject3D("axis", this.axis);
			this.axis = new THREE.AxesHelper(data.size);
			this.el.setObject3D(this.attrName, this.axis);
		}
	},
	remove: function () {
		this.el.dispose();
		this.el.removeObject3D("axis", this.axis);
	},
});

function isEqualVec3(a, b) {
	if (!a || !b) {
		return false;
	}
	return a.x === b.x && a.y === b.y && a.z === b.z;
}


/***/ }),

/***/ "./src/components/meshgen.js":
/*!***********************************!*\
  !*** ./src/components/meshgen.js ***!
  \***********************************/
/***/ (() => {

// window.Headers.set("Cross-Origin-Opener-Policy", "same-origin");
// window.Headers.set("Cross-Origin-Embedder-Policy", "require-corp");

class VoxelGen {
	face_info = {
		right: { normal: [1, 0, 0] },
		left: { normal: [-1, 0, 0] },
		top: { normal: [0, 1, 0] },
		bottom: { normal: [0, -1, 0] },
		front: { normal: [0, 0, 1] },
		back: { normal: [0, 0, -1] },
	};
	vertex_component_info = {
		position: 3,
		normal: 3,
		uv: 2,
		color: 3,
	};
	uv_info = [
		[0, 0],
		[1, 0],
		[0, 1],
		[1, 1],
	];
	constructor() {
		this.geo = {};
		this.genGenFaces();
	}
	genGenFaces() {
		const genFace = (vert, uv, normal) => {
			let g = new THREE.BufferGeometry();
			let vert_data = vert.flatMap((x) => x);
			let uv_data = uv.flatMap((x) => x);
			let normal_data = new Array(4).fill(normal).flatMap((x) => x);
			let color_data = new Array(4).fill([1, 1, 1]).flatMap((x) => x);
			g.setAttribute(
				"position",
				new THREE.BufferAttribute(new Float32Array(vert_data), this.vertex_component_info.position)
			);
			g.setAttribute(
				"normal",
				new THREE.BufferAttribute(new Float32Array(normal_data), this.vertex_component_info.normal)
			);
			g.setAttribute(
				"uv",
				new THREE.BufferAttribute(new Float32Array(uv_data), this.vertex_component_info.uv)
			);
			g.setAttribute(
				"color",
				new THREE.BufferAttribute(new Float32Array(color_data), this.vertex_component_info.color)
			);
			g.setIndex([0, 1, 2, 2, 1, 3]);
			return g;
		};
		// right
		this.geo.right = genFace(
			[
				[1, 0, 1],
				[1, 0, 0],
				[1, 1, 1],
				[1, 1, 0],
			],
			this.uv_info,
			this.face_info.right.normal
		);
		// left
		this.geo.left = genFace(
			[
				[0, 0, 0],
				[0, 0, 1],
				[0, 1, 0],
				[0, 1, 1],
			],
			this.uv_info,
			this.face_info.left.normal
		);
		// top
		this.geo.top = genFace(
			[
				[0, 1, 1],
				[1, 1, 1],
				[0, 1, 0],
				[1, 1, 0],
			],
			this.uv_info,
			this.face_info.top.normal
		);
		// bottom
		this.geo.bottom = genFace(
			[
				[0, 0, 0],
				[1, 0, 0],
				[0, 0, 1],
				[1, 0, 1],
			],
			this.uv_info,
			this.face_info.bottom.normal
		);
		// front
		this.geo.front = genFace(
			[
				[0, 0, 1],
				[1, 0, 1],
				[0, 1, 1],
				[1, 1, 1],
			],
			this.uv_info,
			this.face_info.front.normal
		);
		// back
		this.geo.back = genFace(
			[
				[1, 0, 0],
				[0, 0, 0],
				[1, 1, 0],
				[0, 1, 0],
			],
			this.uv_info,
			this.face_info.back.normal
		);
	}

	genSparseVoxel(sides, x, y, z, type) {
		let side_meshes = [];

		if (sides[0]) side_meshes.push(this.geo.right.clone());
		if (sides[1]) side_meshes.push(this.geo.left.clone());
		if (sides[2]) side_meshes.push(this.geo.top.clone());
		if (sides[3]) side_meshes.push(this.geo.bottom.clone());
		if (sides[4]) side_meshes.push(this.geo.front.clone());
		if (sides[5]) side_meshes.push(this.geo.back.clone());

		let g = THREE.BufferGeometryUtils.mergeBufferGeometries(side_meshes);
		g.setAttribute(
			"color",
			new THREE.BufferAttribute(
				new Float32Array(new Array(4 * side_meshes.length).fill(type.color).flatMap((x) => x)),
				this.vertex_component_info.color
			)
		);
		g.translate(x, y, z);
		return g;
	}
}

AFRAME.registerGeometry("testgen", {
	init: function () {
		// THREE.BufferGeometryUtils.mergeBufferGeometries(vox);
		// let a = new THREE.PlaneBufferGeometry(1, 1);
		// let e = [];
		// e.push(a);
		// let aa = a.clone();
		// aa.translate(1, 0, 1);
		// e.push(aa);
		let voxel = VoxelGen.genFullVoxel(0, 0, 0);
		this.geometry = voxel;
	},
});

AFRAME.registerGeometry("map", {
	init: function () {
		const cm = new ChunkingManager();
		cm.requestChunk(0, 0, 0);
		let chunkgen = new ChunkGen(undefined, 16);
		// let chunk = chunkgen.generateChunk(0, 0, 0);
		let chunk = ChunkGen.getMockChunk();
		let vmb = new VoxelMeshBuilder();
		let mesh = vmb.constructChunk(chunk);
		this.geometry = mesh;
	},
});

const BLOCK = {
	BT_1: { color: [0, 0, 0] },
	BT_2: { color: [0, 0, 0.5] },
	BT_3: { color: [0, 1, 0] },
	BT_4: { color: [0, 1, 1] },
	BT_5: { color: [1, 0, 0] },
	BT_6: { color: [1, 0, 1] },
	BT_7: { color: [1, 1, 0] },
	BT_8: { color: [1, 1, 1] },
	BLACK: { color: [0, 0, 0] },
	RED: { color: [1, 0, 0] },
	BLUE: { color: [0, 0, 1] },
};
const blockArray = [
	BLOCK.BT_1,
	BLOCK.BT_2,
	BLOCK.BT_3,
	BLOCK.BT_4,
	BLOCK.BT_5,
	BLOCK.BT_6,
	BLOCK.BT_7,
	BLOCK.BT_8,
];

AFRAME.registerComponent("chunk-loader-actor", {
	schema: {
		range: { type: "number", default: 16 },
	},
	init: function () {
		this.tick = AFRAME.utils.throttleTick(this.tick, 500, this);
		const cm = ChunkingManager();
	},
	tick: function (t, dt) {
		this.el.position();
	},
});

class VoxelMeshBuilder {
	constructor() {
		this.builder = new VoxelGen();
	}
	/** generates a chunk mesh with given chunk */
	constructChunk(chunk) {
		let blockMap = this._chunkDataToBlockMap(chunk.data);
		let bg = [];
		for (let i = 0; i < chunk.data.length; i++) {
			const block = chunk.data[i];
			// XP XN  YP  YN  ZP  ZN

			const sides = [
				this._checkSides(blockMap, block.x + 1, block.y, block.z),
				this._checkSides(blockMap, block.x - 1, block.y, block.z),
				this._checkSides(blockMap, block.x, block.y + 1, block.z),
				this._checkSides(blockMap, block.x, block.y - 1, block.z),
				this._checkSides(blockMap, block.x, block.y, block.z + 1),
				this._checkSides(blockMap, block.x, block.y, block.z - 1),
			];
			if (!sides.some((x) => x == true)) continue;
			let voxel = this.builder.genSparseVoxel(sides, block.x, block.y, block.z, block.t);

			bg.push(voxel);
		}
		return THREE.BufferGeometryUtils.mergeBufferGeometries(bg);
	}
	_checkSides(blockMap, x, y, z) {
		let c = this._gen3DKey(x, y, z);
		if (!blockMap.has(c)) {
			return true;
		}
		return false;
	}
	/** generates blockmap from chunkdata */
	_chunkDataToBlockMap(array) {
		let m = new Map();
		for (let i = 0; i < array.length; i++)
			m.set(this._gen3DKey(array[i].x, array[i].y, array[i].z), false);
		return m;
	}
	/** generates a key from 3D coords */
	_gen3DKey(x, y, z) {
		return `${x}-${y}-${z}`;
	}
}

class ChunkingManager {
	constructor() {
		this.chunks = new Map();
		this.builder = new VoxelMeshBuilder();
	}
	addChunk(chunk) {
		this.chunks.set(this._gen3DKey(chunk.x, chunk.y, chunk.z), chunk);
	}
	removeChunk(chunkKey) {
		console.log(`Removing Chunk ${x}-${y}-${z}`);
		//todo remove chunk
		this.chunks.delete(chunkKey);
	}
	/** loads a chunk into the scene */
	loadChunk(chunkKey) {
		//todo remove chunk
		console.log(`Loading Chunk ${chunkKey}`);
	}
	/** request a chunk from the Server */
	unloadChunk(chunkKey) {
		//todo unload the chunk
		//todo remove it from the mesh
		//todo
		console.log(`Unloading Chunk ${chunkKey}`);
	}
	/** request a chunk from the Server */
	requestChunk(x, y, z) {
		console.log(`Requesting Chunk ${x}-${y}-${z}`);
		//todo request chunk from server
		let chunk = ChunkGen.getMockChunk(x, y, z);
		//todo get chunkdata
		//todo construct chunk
		this.builder.constructChunk(chunk);
	}
	/** generates a key from 3D coords */
	_gen3DKey(x, y, z) {
		return `${x}-${y}-${z}`;
	}
}

class ChunkGen {
	constructor(tex_def, chunksize) {
		this.tex_def = tex_def ?? {};
		this.chunksize = chunksize ?? 16;
	}

	generateChunk(x, y, z) {
		let chunk = [];
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				for (let z = 0; z < 16; z++) {
					if (Math.random() > 0.5) chunk.push({ x: x, y: y, z: z });
				}
			}
		}
		return {
			ratio: chunk.length / Math.pow(this.chunksize, 3),
			data: chunk,
		};
	}
	static getMockChunk() {
		let chunk = [];
		for (let x = 0; x < 16; x++) {
			for (let y = 0; y < 16; y++) {
				for (let z = 0; z < 16; z++) {
					if (Math.random() > 0.5) {
						chunk.push({
							x: x,
							y: y,
							z: z,
							t: blockArray[Math.floor((Math.random() * 1000) % blockArray.length)],
						});
					}
				}
			}
		}
		return {
			ratio: chunk.length / Math.pow(16, 3),
			data: chunk,
		};
	}
}

// class Chunker {
// 	constructor() {}
// 	requestChunk(x, y, z) {
// 		console.log(`Requesting Chunk ${x}-${y}-${z}`)
// 		// request chunk from server
// 		// get chunkdata
// 		// construct chunk
// 	}
// 	loadChunk(chunkKey) {
// 		console.log(`Loading Chunk ${chunkKey}`)
// 	}
// 	unloadChunk(chunkKey) {
// 		console.log(`Unloading Chunk ${chunkKey}`)
// 	}
// }

// ChunkGen -> Chunk<VoxelData> -> mesh generator

// noise -> simplex(Continental noise)
// SHAPE
// - CONTINENTAL MAP
// - EROSION MAP
// - HILLS&VALLEYS MAP
// CAVE
// - cave map?
// BIOME
// - TEMPERATURE MAP
// - HUMIDITY MAP


/***/ }),

/***/ "./src/components/voxelres.js":
/*!************************************!*\
  !*** ./src/components/voxelres.js ***!
  \************************************/
/***/ (() => {

const VERTEX_SHADER = [
	`precision mediump float;`,
	`attribute vec3 position;`,
	`attribute vec3 normal;`,
	`attribute vec2 uv;`,
	`attribute vec3 color;`,
	`uniform mat4 projectionMatrix;`,
	`uniform mat4 modelMatrix;`,
	`uniform mat4 modelViewMatrix;`,
	`varying vec3 vWorldPosition;`,
	`varying vec2 vUv;`,
	`varying vec3 vNormal;`,
	`varying vec3 vColor;`,
	`void main(){`,
	` vUv = uv;`,
	` vNormal = normal;`,
	`	vColor = color;`,
	`	vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;`,
	` gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);`,
	`}`,
].join("\n");

const FRAGMENT_SHADER = `
precision mediump float;

float hash1( float n )
{
    return fract( n*17.0*fract( n*0.3183099 ) );
}

vec4 noised( in vec3 x )
{
    vec3 p = floor(x);
    vec3 w = fract(x);
    
    vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
    vec3 du = 30.0*w*w*(w*(w-2.0)+1.0);

    float n = p.x + 317.0*p.y + 157.0*p.z;
    
    float a = hash1(n+0.0);
    float b = hash1(n+1.0);
    float c = hash1(n+317.0);
    float d = hash1(n+318.0);
    float e = hash1(n+157.0);
		float f = hash1(n+158.0);
    float g = hash1(n+474.0);
    float h = hash1(n+475.0);

    float k0 =   a;
    float k1 =   b - a;
    float k2 =   c - a;
    float k3 =   e - a;
    float k4 =   a - b - c + d;
    float k5 =   a - c - e + g;
    float k6 =   a - b - e + f;
    float k7 = - a + b + c - d + e - f - g + h;

    return vec4( -1.0+2.0*(k0 + k1*u.x + k2*u.y + k3*u.z + k4*u.x*u.y + k5*u.y*u.z + k6*u.z*u.x + k7*u.x*u.y*u.z), 
                      2.0* du * vec3( k1 + k4*u.y + k6*u.z + k7*u.y*u.z,
                                      k2 + k5*u.z + k4*u.x + k7*u.z*u.x,
                                      k3 + k6*u.x + k5*u.y + k7*u.x*u.y ) );
}

uniform mat4 viewMatrix;
uniform vec3 cameraPosition;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vColor;

uniform float ambientLightColor;


void main() {
	vec4 outColor = vec4(vColor.xyz, 1.0);
  gl_FragColor = outColor;
}
`;

var propertyToThreeMapping = {
	array: "v3",
	color: "v3",
	int: "i",
	number: "f",
	map: "t",
	time: "f",
	vec2: "v2",
	vec3: "v3",
	vec4: "v4",
};

const pointShaderVert = `uniform float size;
uniform float scale;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	// assumes rgb is in linear color space with sRGB primaries and D65 white point
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	// dir is assumed to be unit length
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}

#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif

#ifdef USE_FOG
	varying float vFogDepth;
#endif

#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif

#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif

void main() {

  #if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif

	#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif

	vec3 transformed = vec3( position );

	#ifdef USE_MORPHTARGETS
	// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:
	// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)
	// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif

	vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;

	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif

	#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif

#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif

	#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif

	#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif
}`;
const pointShaderFrag = `uniform vec3 diffuse;
uniform float opacity;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
// <tonemapping_pars_fragment> may have defined saturate() already
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
struct GeometricContext {
	vec3 position;
	vec3 normal;
	vec3 viewDir;
#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal;
#endif
};
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	// dir can be either a direction vector or a normal vector
	// upper-left 3x3 of matrix is assumed to be orthogonal
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	// assumes rgb is in linear color space with sRGB primaries and D65 white point
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	// dir is assumed to be unit length
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}

#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif

#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	uniform mat3 uvTransform;
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif

#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif

#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif

#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif

#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif

void main() {

#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif

	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );

#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	// Doing a strict comparison with == 1.0 can cause noise artifacts
	// on some platforms. See issue #17623.
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif

#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif

#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif

#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif

	outgoingLight = diffuseColor.rgb;

#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
// https://github.com/mrdoob/three.js/pull/22425
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha + 0.1;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );

#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif

gl_FragColor = linearToOutputTexel( gl_FragColor );

#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif

#ifdef PREMULTIPLIED_ALPHA
	// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.
	gl_FragColor.rgb *= gl_FragColor.a;
#endif

}`;

AFRAME.registerShader("pointsShader", {
	schema: {
		// fogDensity: { type:"number",is: "uniform",default: 0.00025 },
		// fogNear: { type:"number",is: "uniform",default: 1 },
		// fogFar: { type:"number",is: "uniform",default: 2000 },
		// fogColor: { type:"color",is: "uniform",default: new Color(0xffffff) },
		// diffuse: { type:"color",is: "uniform",default: /*@__PURE__*/ new Color(0xffffff) },
		// opacity: { type:"number",is: "uniform",default: 1.0 },
		// size: { type:"number",is: "uniform",default: 1.0 },
		// scale: { type:"number",is: "uniform",default: 1.0 },
		// map: { is: "uniform",default: null },
		// alphaMap: { is: "uniform",default: null },
		// alphaTest: { is: "uniform",default: 0 },
		// uvTransform: { is: "uniform",default: /*@__PURE__*/ new Matrix3() },
	},
	vertexShader: pointShaderVert,
	fragmentShader: pointShaderFrag,
	init: function (data) {
		console.log(AFRAME);
		console.log(THREE);
		console.log(THREE.UniformsLib.points);
		let fog_uni = THREE.UniformsLib.fog;
		let points_uni = THREE.UniformsLib.points;
		points_uni.diffuse.value.g = 0;
		points_uni.diffuse.value.b = 0;
		this.attributes = this.initVariables(data, "attribute");
		this.uniforms = THREE.UniformsUtils.merge([
			this.initVariables(data, "uniform"),
			// THREE.UniformsLib["lights"],
			fog_uni,
			points_uni,
		]);
		this.material = new (this.raw ? THREE.RawShaderMaterial : THREE.ShaderMaterial)({
			// attributes: this.attributes,
			uniforms: this.uniforms,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
			// lights: true,
		});
		return this.material;
	},

	initVariables: function (data, type) {
		var key;
		var schema = this.schema;
		var variables = {};
		var varType;

		for (key in schema) {
			if (schema[key].is !== type) {
				continue;
			}
			varType = propertyToThreeMapping[schema[key].type];
			variables[key] = {
				type: varType,
				value: undefined, // Let updateVariables handle setting these.
			};
		}
		return variables;
	},
});

AFRAME.registerGeometry("point", {
	init: function () {
		// const vertices = [];

		// for (let i = 0; i < 10000; i++) {
		// 	const x = THREE.MathUtils.randFloatSpread(2000);
		// 	const y = THREE.MathUtils.randFloatSpread(2000);
		// 	const z = THREE.MathUtils.randFloatSpread(2000);

		// 	vertices.push(x, y, z);
		// }
		// const geometry = new THREE.BufferGeometry();
		// geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
		// return geometry;
	},
});

AFRAME.registerShader("voxelres", {
	schema: {
		t: { type: "time", is: "uniform", default: 0.0 },
	},
	raw: true,
	vertexShader: VERTEX_SHADER,
	fragmentShader: FRAGMENT_SHADER,
	init: function (data) {
		console.log(AFRAME);
		this.attributes = this.initVariables(data, "attribute");
		this.uniforms = THREE.UniformsUtils.merge([
			this.initVariables(data, "uniform"),
			THREE.UniformsLib["lights"],
		]);
		this.material = new (this.raw ? THREE.RawShaderMaterial : THREE.ShaderMaterial)({
			// attributes: this.attributes,
			uniforms: this.uniforms,
			vertexShader: this.vertexShader,
			fragmentShader: this.fragmentShader,
			lights: true,
		});
		return this.material;
	},

	initVariables: function (data, type) {
		var key;
		var schema = this.schema;
		var variables = {};
		var varType;

		for (key in schema) {
			if (schema[key].is !== type) {
				continue;
			}
			varType = propertyToThreeMapping[schema[key].type];
			variables[key] = {
				type: varType,
				value: undefined, // Let updateVariables handle setting these.
			};
		}
		return variables;
	},
});
// console.log(AFRAME);
// export const sm = new THREE.RawShaderMaterial({
// 	lights: true,
// 	vertexShader: VERTEX_SHADER,
// 	fragmentShader: FRAGMENT_SHADER,
// });

// uniforms.ambientLightColor.value = lights.state.ambient;
// uniforms.lightProbe.value = lights.state.probe;
// uniforms.directionalLights.value = lights.state.directional;
// uniforms.directionalLightShadows.value = lights.state.directionalShadow;
// uniforms.spotLights.value = lights.state.spot;
// uniforms.spotLightShadows.value = lights.state.spotShadow;
// uniforms.rectAreaLights.value = lights.state.rectArea;
// uniforms.ltc_1.value = lights.state.rectAreaLTC1;
// uniforms.ltc_2.value = lights.state.rectAreaLTC2;
// uniforms.pointLights.value = lights.state.point;
// uniforms.pointLightShadows.value = lights.state.pointShadow;
// uniforms.hemisphereLights.value = lights.state.hemi;
// uniforms.directionalShadowMap.value = lights.state.directionalShadowMap;
// uniforms.directionalShadowMatrix.value = lights.state.directionalShadowMatrix;
// uniforms.spotShadowMap.value = lights.state.spotShadowMap;
// uniforms.spotShadowMatrix.value = lights.state.spotShadowMatrix;
// uniforms.pointShadowMap.value = lights.state.pointShadowMap;
// uniforms.pointShadowMatrix.value = lights.state.pointShadowMatrix; // TODO (abelnation): add area lights shadow info to uniforms


/***/ }),

/***/ "./src/components sync \\.js$":
/*!*************************************************!*\
  !*** ./src/components/ sync nonrecursive \.js$ ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./SpriteAtlas.js": "./src/components/SpriteAtlas.js",
	"./helpers.js": "./src/components/helpers.js",
	"./meshgen.js": "./src/components/meshgen.js",
	"./voxelres.js": "./src/components/voxelres.js",
	"components/SpriteAtlas.js": "./src/components/SpriteAtlas.js",
	"components/helpers.js": "./src/components/helpers.js",
	"components/meshgen.js": "./src/components/meshgen.js",
	"components/voxelres.js": "./src/components/voxelres.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/components sync \\.js$";

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
function importAll(r) {
  r.keys().forEach(r);
}

importAll(__webpack_require__("./src/components sync \\.js$"));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxJQUFJOzs7Ozs7Ozs7OztBQ3RCSjtBQUNBO0FBQ0E7QUFDQSxVQUFVLDBCQUEwQjtBQUNwQyxlQUFlLDBCQUEwQjtBQUN6QyxxQkFBcUIsbUNBQW1DO0FBQ3hELGVBQWUsbUNBQW1DO0FBQ2xELGdCQUFnQiwrQkFBK0I7QUFDL0MsZ0JBQWdCLGlDQUFpQztBQUNqRCxnQkFBZ0IsZ0NBQWdDO0FBQ2hELEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDBDQUEwQztBQUM1RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGLHVCQUF1QjtBQUN2QixxQkFBcUI7QUFDckIsdUJBQXVCO0FBQ3ZCLHNCQUFzQjtBQUN0QixxQkFBcUI7QUFDckIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFNBQVMseUJBQXlCLG9CQUFvQjtBQUN0RCxZQUFZLHlCQUF5QixvQkFBb0I7QUFDekQsWUFBWSw0QkFBNEI7QUFDeEMsV0FBVyxtQ0FBbUM7QUFDOUMsYUFBYSw0QkFBNEI7QUFDekMsYUFBYSxlQUFlO0FBQzVCLGdCQUFnQiw0QkFBNEI7QUFDNUMsZUFBZSw0QkFBNEI7QUFDM0MsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0EsRUFBRTtBQUNGLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxVQUFVLDBCQUEwQjtBQUNwQyxlQUFlLDBCQUEwQjtBQUN6QyxxQkFBcUIsbUNBQW1DO0FBQ3hELGVBQWUsbUNBQW1DO0FBQ2xELEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFVBQVUseUJBQXlCO0FBQ25DLGdCQUFnQiwrQkFBK0I7QUFDL0MsZ0JBQWdCLGlDQUFpQztBQUNqRCxnQkFBZ0IsZ0NBQWdDO0FBQ2hELEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3JMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxtQkFBbUI7QUFDOUIsVUFBVSxvQkFBb0I7QUFDOUIsU0FBUyxtQkFBbUI7QUFDNUIsWUFBWSxvQkFBb0I7QUFDaEMsV0FBVyxtQkFBbUI7QUFDOUIsVUFBVSxvQkFBb0I7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0YsQ0FBQztBQUNEO0FBQ0E7QUFDQSxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUM3QixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGtCQUFrQjtBQUMzQixTQUFTLGtCQUFrQjtBQUMzQixVQUFV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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQywrQkFBK0I7QUFDL0IsaUNBQWlDO0FBQ2pDLGlDQUFpQyxnQkFBZ0I7QUFDakQsZ0NBQWdDO0FBQ2hDLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O1VDN0JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBOzs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVLG1EQUErQyIsInNvdXJjZXMiOlsid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvU3ByaXRlQXRsYXMuanMiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvLi9zcmMvY29tcG9uZW50cy9oZWxwZXJzLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHMvbWVzaGdlbi5qcyIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9jb21wb25lbnRzL3ZveGVscmVzLmpzIiwid2VicGFjazovL2FmcmFtZS13ZWJwYWNrLWJvaWxlcnBsYXRlLy4vc3JjL2NvbXBvbmVudHN8c3luY3xub25yZWN1cnNpdmV8Ly5qcyQiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYWZyYW1lLXdlYnBhY2stYm9pbGVycGxhdGUvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9hZnJhbWUtd2VicGFjay1ib2lsZXJwbGF0ZS8uL3NyYy9tYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIC8vIFRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9pc3N1ZXMvNzU4XHJcbi8vIGZ1bmN0aW9uIF9HZXRJbWFnZURhdGEoaW1hZ2UpIHtcclxuLy8gXHR2YXIgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuLy8gXHRjYW52YXMud2lkdGggPSBpbWFnZS53aWR0aDtcclxuLy8gXHRjYW52YXMuaGVpZ2h0ID0gaW1hZ2UuaGVpZ2h0O1xyXG5cclxuLy8gXHR2YXIgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcbi8vIFx0Y29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDApO1xyXG5cclxuLy8gXHRyZXR1cm4gY29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCk7XHJcbi8vIH1cclxuXHJcbi8vIGNsYXNzIFNwcml0ZUF0bGFzIHtcclxuLy8gXHRjb25zdHJ1Y3RvcigpIHt9XHJcbi8vIH1cclxuXHJcbi8vIEFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcInRlc3RcIiwge1xyXG4vLyAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuLy8gICAgIGNvbnN0IGZsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImEtYXNzZXRzXCIpLmZpbGVMb2FkZXI7XHJcbiAgICBcclxuLy8gXHRcdGNvbnNvbGUubG9nKGZsKTtcclxuLy8gXHR9LFxyXG4vLyB9KTtcclxuIiwiQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ2l6bW9cIiwge1xyXG5cdGRlcGVuZGVuY3k6IFtcImFycm93XCIsIFwiYXhpc1wiXSxcclxuXHRzY2hlbWE6IHtcclxuXHRcdHNpemU6IHsgdHlwZTogXCJpbnRcIiwgZGVmYXVsdDogMTAgfSxcclxuXHRcdGRpdmlzaW9uczogeyB0eXBlOiBcImludFwiLCBkZWZhdWx0OiAxMCB9LFxyXG5cdFx0Y29sb3JDZW50ZXJMaW5lOiB7IHR5cGU6IFwiY29sb3JcIiwgZGVmYXVsdDogXCIjNDQ0NDQ0XCIgfSxcclxuXHRcdGNvbG9yR3JpZDogeyB0eXBlOiBcImNvbG9yXCIsIGRlZmF1bHQ6IFwiIzg4ODg4OFwiIH0sXHJcblx0XHR4QXhpc0NvbG9yOiB7IHR5cGU6IFwiY29sb3JcIiwgZGVmYXVsdDogXCJyZWRcIiB9LFxyXG5cdFx0eUF4aXNDb2xvcjogeyB0eXBlOiBcImNvbG9yXCIsIGRlZmF1bHQ6IFwiZ3JlZW5cIiB9LFxyXG5cdFx0ekF4aXNDb2xvcjogeyB0eXBlOiBcImNvbG9yXCIsIGRlZmF1bHQ6IFwiYmx1ZVwiIH0sXHJcblx0fSxcclxuXHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHRcdGNvbnN0IHNjZW5lID0gdGhpcy5lbDtcclxuXHJcblx0XHQvLyBnZW5lcmF0aW5nIG1haW4gYXhpcyBsaW5lc1xyXG5cdFx0Y29uc3QgZ2l6bW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYS1lbnRpdHlcIik7XHJcblx0XHRjb25zdCBheGlzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImEtZW50aXR5XCIpO1xyXG5cdFx0YXhpcy5zZXRBdHRyaWJ1dGUoXCJheGlzXCIsIFwic2l6ZVwiLCBkYXRhLnNpemUpO1xyXG5cdFx0YXhpcy5zZXRBdHRyaWJ1dGUoXCJheGlzXCIsIFwieEF4aXNDb2xvclwiLCBkYXRhLnhBeGlzQ29sb3IpO1xyXG5cdFx0YXhpcy5zZXRBdHRyaWJ1dGUoXCJheGlzXCIsIFwieUF4aXNDb2xvclwiLCBkYXRhLnlBeGlzQ29sb3IpO1xyXG5cdFx0YXhpcy5zZXRBdHRyaWJ1dGUoXCJheGlzXCIsIFwiekF4aXNDb2xvclwiLCBkYXRhLnpBeGlzQ29sb3IpO1xyXG5cclxuXHRcdC8vIGdlbmVyYXRpbmcgZ3JpZCBsaW5lc1xyXG5cdFx0Y29uc3QgZ3JpZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhLWVudGl0eVwiKTtcclxuXHRcdGdyaWQuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgeyB4OiBkYXRhLnNpemUgLyAyLCB5OiAwLCB6OiBkYXRhLnNpemUgLyAyIH0pO1xyXG5cdFx0Z3JpZC5zZXRBdHRyaWJ1dGUoXCJncmlkXCIsIFwic2l6ZVwiLCBkYXRhLnNpemUpO1xyXG5cdFx0Z3JpZC5zZXRBdHRyaWJ1dGUoXCJncmlkXCIsIFwiZGl2aXNpb25zXCIsIGRhdGEuZGl2aXNpb25zKTtcclxuXHRcdGdyaWQuc2V0QXR0cmlidXRlKFwiZ3JpZFwiLCBcImNvbG9yQ2VudGVyTGluZVwiLCBkYXRhLmNvbG9yQ2VudGVyTGluZSk7XHJcblx0XHRncmlkLnNldEF0dHJpYnV0ZShcImdyaWRcIiwgXCJjb2xvckdyaWRcIiwgZGF0YS5jb2xvckdyaWQpO1xyXG5cclxuXHRcdGdpem1vLmFwcGVuZENoaWxkKGdyaWQpO1xyXG5cdFx0Z2l6bW8uYXBwZW5kQ2hpbGQoYXhpcyk7XHJcblx0XHRzY2VuZS5hcHBlbmRDaGlsZChnaXptbyk7XHJcblx0fSxcclxuXHR1cGRhdGU6IGZ1bmN0aW9uICgpIHt9LFxyXG5cdHRpY2s6IGZ1bmN0aW9uICgpIHt9LFxyXG5cdHJlbW92ZTogZnVuY3Rpb24gKCkge30sXHJcblx0cGF1c2U6IGZ1bmN0aW9uICgpIHt9LFxyXG5cdHBsYXk6IGZ1bmN0aW9uICgpIHt9LFxyXG59KTtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFycm93XCIsIHtcclxuXHRzY2hlbWE6IHtcclxuXHRcdGRpcjogeyB0eXBlOiBcInZlYzNcIiwgZGVmYXVsdDogeyB4OiAwLCB5OiAwLCB6OiAwIH0gfSxcclxuXHRcdG9yaWdpbjogeyB0eXBlOiBcInZlYzNcIiwgZGVmYXVsdDogeyB4OiAwLCB5OiAwLCB6OiAwIH0gfSxcclxuXHRcdGxlbmd0aDogeyB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAxIH0sXHJcblx0XHRjb2xvcjogeyB0eXBlOiBcImNvbG9yXCIsIGRlZmF1bHQ6IFwiIzc0QkVDMVwiIH0sXHJcblx0XHRvcGFjaXR5OiB7IHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDEgfSxcclxuXHRcdHZpc2libGU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxyXG5cdFx0aGVhZGxlbmd0aDogeyB0eXBlOiBcIm51bWJlclwiLCBkZWZhdWx0OiAwIH0sXHJcblx0XHRoZWFkd2lkdGg6IHsgdHlwZTogXCJudW1iZXJcIiwgZGVmYXVsdDogMCB9LFxyXG5cdH0sXHJcblxyXG5cdG11bHRpcGxlOiB0cnVlLFxyXG5cclxuXHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHRcdHRoaXMuYXJyb3cgPSBuZXcgVEhSRUUuQXJyb3dIZWxwZXIoXHJcblx0XHRcdG5ldyBUSFJFRS5WZWN0b3IzKGRhdGEuZGlyLngsIGRhdGEuZGlyLnksIGRhdGEuZGlyLnopLm5vcm1hbGl6ZSgpLFxyXG5cdFx0XHRuZXcgVEhSRUUuVmVjdG9yMyhkYXRhLm9yaWdpbi54LCBkYXRhLm9yaWdpbi55LCBkYXRhLm9yaWdpbi56KSxcclxuXHRcdFx0ZGF0YS5sZW5ndGgsXHJcblx0XHRcdGRhdGEuY29sb3IsXHJcblx0XHRcdGRhdGEuaGVhZGxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IGRhdGEuaGVhZGxlbmd0aCxcclxuXHRcdFx0ZGF0YS5oZWFkd2lkdGggPT09IDAgPyB1bmRlZmluZWQgOiBkYXRhLmhlYWR3aWR0aFxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLmVsLnNldE9iamVjdDNEKHRoaXMuYXR0ck5hbWUsIHRoaXMuYXJyb3cpO1xyXG5cdH0sXHJcblx0dXBkYXRlOiBmdW5jdGlvbiAob2xkRGF0YSkge1xyXG5cdFx0dmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcblxyXG5cdFx0aWYgKGRhdGEuY29sb3IgIT09IG9sZERhdGEuY29sb3IpIHRoaXMuYXJyb3cuc2V0Q29sb3IoZGF0YS5jb2xvcik7XHJcblxyXG5cdFx0aWYgKCFpc0VxdWFsVmVjMyhkYXRhLmRpciwgb2xkRGF0YS5kaXIpKVxyXG5cdFx0XHR0aGlzLmFycm93LnNldERpcmVjdGlvbihuZXcgVEhSRUUuVmVjdG9yMyhkYXRhLmRpci54LCBkYXRhLmRpci55LCBkYXRhLmRpci56KS5ub3JtYWxpemUoKSk7XHJcblx0XHRjb25zb2xlLmxvZyhkYXRhLm9yaWdpbiwgb2xkRGF0YS5vcmlnaW4pO1xyXG5cdFx0aWYgKCFpc0VxdWFsVmVjMyhkYXRhLm9yaWdpbiwgb2xkRGF0YS5vcmlnaW4pKSB7XHJcblx0XHRcdHRoaXMuYXJyb3cucG9zaXRpb24ueCA9IGRhdGEub3JpZ2luLng7XHJcblx0XHRcdHRoaXMuYXJyb3cucG9zaXRpb24ueSA9IGRhdGEub3JpZ2luLnk7XHJcblx0XHRcdHRoaXMuYXJyb3cucG9zaXRpb24ueiA9IGRhdGEub3JpZ2luLno7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZWwucmVtb3ZlT2JqZWN0M0QoXCJhcnJvd1wiLCB0aGlzLmFycm93KTtcclxuXHR9LFxyXG59KTtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdyaWRcIiwge1xyXG5cdHNjaGVtYToge1xyXG5cdFx0c2l6ZTogeyB0eXBlOiBcImludFwiLCBkZWZhdWx0OiAxMCB9LFxyXG5cdFx0ZGl2aXNpb25zOiB7IHR5cGU6IFwiaW50XCIsIGRlZmF1bHQ6IDEwIH0sXHJcblx0XHRjb2xvckNlbnRlckxpbmU6IHsgdHlwZTogXCJjb2xvclwiLCBkZWZhdWx0OiBcIiM0NDQ0NDRcIiB9LFxyXG5cdFx0Y29sb3JHcmlkOiB7IHR5cGU6IFwiY29sb3JcIiwgZGVmYXVsdDogXCIjODg4ODg4XCIgfSxcclxuXHR9LFxyXG5cdG11bHRpcGxlOiB0cnVlLFxyXG5cdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG5cdFx0dGhpcy5ncmlkID0gbmV3IFRIUkVFLkdyaWRIZWxwZXIoXHJcblx0XHRcdGRhdGEuc2l6ZSxcclxuXHRcdFx0ZGF0YS5kaXZpc2lvbnMsXHJcblx0XHRcdGRhdGEuY29sb3JDZW50ZXJMaW5lLFxyXG5cdFx0XHRkYXRhLmNvbG9yR3JpZFxyXG5cdFx0KTtcclxuXHJcblx0XHR0aGlzLmVsLnNldE9iamVjdDNEKHRoaXMuYXR0ck5hbWUsIHRoaXMuZ3JpZCk7XHJcblx0fSxcclxuXHR1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XHJcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcblx0XHQvLyB1cGRhdGUgc2l6ZVxyXG5cdFx0Ly8gdXBkYXRlIGRpdmlzaW9uc1xyXG5cdFx0Ly8gdXBkYXRlIGNvbG9yQ2VudGVyTGluZVxyXG5cdFx0Ly8gdXBkYXRlIGNvbG9yR3JpZFxyXG5cdFx0aWYgKFxyXG5cdFx0XHRkYXRhLnNpemUgIT09IG9sZERhdGEuc2l6ZSB8fFxyXG5cdFx0XHRkYXRhLmRpdmlzaW9ucyAhPT0gb2xkRGF0YS5kaXZpc2lvbnMgfHxcclxuXHRcdFx0ZGF0YS5jb2xvckNlbnRlckxpbmUgIT09IG9sZERhdGEuY29sb3JDZW50ZXJMaW5lIHx8XHJcblx0XHRcdGRhdGEuY29sb3JHcmlkICE9PSBvbGREYXRhLmNvbG9yR3JpZFxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuZWwucmVtb3ZlT2JqZWN0M0QoXCJncmlkXCIsIHRoaXMuZ3JpZCk7XHJcblx0XHRcdHRoaXMuZ3JpZCA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKFxyXG5cdFx0XHRcdGRhdGEuc2l6ZSxcclxuXHRcdFx0XHRkYXRhLmRpdmlzaW9ucyxcclxuXHRcdFx0XHRkYXRhLmNvbG9yQ2VudGVyTGluZSxcclxuXHRcdFx0XHRkYXRhLmNvbG9yR3JpZFxyXG5cdFx0XHQpO1xyXG5cdFx0XHR0aGlzLmVsLnNldE9iamVjdDNEKHRoaXMuYXR0ck5hbWUsIHRoaXMuZ3JpZCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHRoaXMuZWwucmVtb3ZlT2JqZWN0M0QoXCJncmlkXCIsIHRoaXMuZ3JpZCk7XHJcblx0fSxcclxufSk7XHJcblxyXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJheGlzXCIsIHtcclxuXHRzY2hlbWE6IHtcclxuXHRcdHNpemU6IHsgdHlwZTogXCJpbnRcIiwgZGVmYXVsdDogMSB9LFxyXG5cdFx0eEF4aXNDb2xvcjogeyB0eXBlOiBcImNvbG9yXCIsIGRlZmF1bHQ6IFwicmVkXCIgfSxcclxuXHRcdHlBeGlzQ29sb3I6IHsgdHlwZTogXCJjb2xvclwiLCBkZWZhdWx0OiBcImdyZWVuXCIgfSxcclxuXHRcdHpBeGlzQ29sb3I6IHsgdHlwZTogXCJjb2xvclwiLCBkZWZhdWx0OiBcImJsdWVcIiB9LFxyXG5cdH0sXHJcblx0bXVsdGlwbGU6IHRydWUsXHJcblx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGRhdGEgPSB0aGlzLmRhdGE7XHJcblx0XHR0aGlzLmF4aXMgPSBuZXcgVEhSRUUuQXhlc0hlbHBlcihkYXRhLnNpemUpO1xyXG5cclxuXHRcdHRoaXMuYXhpcy5zZXRDb2xvcnMoZGF0YS54QXhpc0NvbG9yLCBkYXRhLnlBeGlzQ29sb3IsIGRhdGEuekF4aXNDb2xvcik7XHJcblx0XHR0aGlzLmVsLnNldE9iamVjdDNEKHRoaXMuYXR0ck5hbWUsIHRoaXMuYXhpcyk7XHJcblx0fSxcclxuXHR1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XHJcblx0XHR2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcblx0XHQvL3VwZGF0aW5nIGNvbG9yc1xyXG5cdFx0aWYgKFxyXG5cdFx0XHRkYXRhLnhBeGlzQ29sb3IgIT09IG9sZERhdGEueEF4aXNDb2xvciB8fFxyXG5cdFx0XHRkYXRhLnlBeGlzQ29sb3IgIT09IG9sZERhdGEueUF4aXNDb2xvciB8fFxyXG5cdFx0XHRkYXRhLnpBeGlzQ29sb3IgIT09IG9sZERhdGEuekF4aXNDb2xvclxyXG5cdFx0KSB7XHJcblx0XHRcdHRoaXMuYXhpcy5zZXRDb2xvcnMoZGF0YS54QXhpc0NvbG9yLCBkYXRhLnlBeGlzQ29sb3IsIGRhdGEuekF4aXNDb2xvcik7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdXBkYXRpbmcgc2l6ZVxyXG5cdFx0aWYgKGRhdGEuc2l6ZSAhPT0gb2xkRGF0YS5zaXplKSB7XHJcblx0XHRcdHRoaXMuYXhpcy5kaXNwb3NlKCk7XHJcblx0XHRcdHRoaXMuZWwucmVtb3ZlT2JqZWN0M0QoXCJheGlzXCIsIHRoaXMuYXhpcyk7XHJcblx0XHRcdHRoaXMuYXhpcyA9IG5ldyBUSFJFRS5BeGVzSGVscGVyKGRhdGEuc2l6ZSk7XHJcblx0XHRcdHRoaXMuZWwuc2V0T2JqZWN0M0QodGhpcy5hdHRyTmFtZSwgdGhpcy5heGlzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5lbC5kaXNwb3NlKCk7XHJcblx0XHR0aGlzLmVsLnJlbW92ZU9iamVjdDNEKFwiYXhpc1wiLCB0aGlzLmF4aXMpO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaXNFcXVhbFZlYzMoYSwgYikge1xyXG5cdGlmICghYSB8fCAhYikge1xyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH1cclxuXHRyZXR1cm4gYS54ID09PSBiLnggJiYgYS55ID09PSBiLnkgJiYgYS56ID09PSBiLno7XHJcbn1cclxuIiwiLy8gd2luZG93LkhlYWRlcnMuc2V0KFwiQ3Jvc3MtT3JpZ2luLU9wZW5lci1Qb2xpY3lcIiwgXCJzYW1lLW9yaWdpblwiKTtcclxuLy8gd2luZG93LkhlYWRlcnMuc2V0KFwiQ3Jvc3MtT3JpZ2luLUVtYmVkZGVyLVBvbGljeVwiLCBcInJlcXVpcmUtY29ycFwiKTtcclxuXHJcbmNsYXNzIFZveGVsR2VuIHtcclxuXHRmYWNlX2luZm8gPSB7XHJcblx0XHRyaWdodDogeyBub3JtYWw6IFsxLCAwLCAwXSB9LFxyXG5cdFx0bGVmdDogeyBub3JtYWw6IFstMSwgMCwgMF0gfSxcclxuXHRcdHRvcDogeyBub3JtYWw6IFswLCAxLCAwXSB9LFxyXG5cdFx0Ym90dG9tOiB7IG5vcm1hbDogWzAsIC0xLCAwXSB9LFxyXG5cdFx0ZnJvbnQ6IHsgbm9ybWFsOiBbMCwgMCwgMV0gfSxcclxuXHRcdGJhY2s6IHsgbm9ybWFsOiBbMCwgMCwgLTFdIH0sXHJcblx0fTtcclxuXHR2ZXJ0ZXhfY29tcG9uZW50X2luZm8gPSB7XHJcblx0XHRwb3NpdGlvbjogMyxcclxuXHRcdG5vcm1hbDogMyxcclxuXHRcdHV2OiAyLFxyXG5cdFx0Y29sb3I6IDMsXHJcblx0fTtcclxuXHR1dl9pbmZvID0gW1xyXG5cdFx0WzAsIDBdLFxyXG5cdFx0WzEsIDBdLFxyXG5cdFx0WzAsIDFdLFxyXG5cdFx0WzEsIDFdLFxyXG5cdF07XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmdlbyA9IHt9O1xyXG5cdFx0dGhpcy5nZW5HZW5GYWNlcygpO1xyXG5cdH1cclxuXHRnZW5HZW5GYWNlcygpIHtcclxuXHRcdGNvbnN0IGdlbkZhY2UgPSAodmVydCwgdXYsIG5vcm1hbCkgPT4ge1xyXG5cdFx0XHRsZXQgZyA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cdFx0XHRsZXQgdmVydF9kYXRhID0gdmVydC5mbGF0TWFwKCh4KSA9PiB4KTtcclxuXHRcdFx0bGV0IHV2X2RhdGEgPSB1di5mbGF0TWFwKCh4KSA9PiB4KTtcclxuXHRcdFx0bGV0IG5vcm1hbF9kYXRhID0gbmV3IEFycmF5KDQpLmZpbGwobm9ybWFsKS5mbGF0TWFwKCh4KSA9PiB4KTtcclxuXHRcdFx0bGV0IGNvbG9yX2RhdGEgPSBuZXcgQXJyYXkoNCkuZmlsbChbMSwgMSwgMV0pLmZsYXRNYXAoKHgpID0+IHgpO1xyXG5cdFx0XHRnLnNldEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcInBvc2l0aW9uXCIsXHJcblx0XHRcdFx0bmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KHZlcnRfZGF0YSksIHRoaXMudmVydGV4X2NvbXBvbmVudF9pbmZvLnBvc2l0aW9uKVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRnLnNldEF0dHJpYnV0ZShcclxuXHRcdFx0XHRcIm5vcm1hbFwiLFxyXG5cdFx0XHRcdG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheShub3JtYWxfZGF0YSksIHRoaXMudmVydGV4X2NvbXBvbmVudF9pbmZvLm5vcm1hbClcclxuXHRcdFx0KTtcclxuXHRcdFx0Zy5zZXRBdHRyaWJ1dGUoXHJcblx0XHRcdFx0XCJ1dlwiLFxyXG5cdFx0XHRcdG5ldyBUSFJFRS5CdWZmZXJBdHRyaWJ1dGUobmV3IEZsb2F0MzJBcnJheSh1dl9kYXRhKSwgdGhpcy52ZXJ0ZXhfY29tcG9uZW50X2luZm8udXYpXHJcblx0XHRcdCk7XHJcblx0XHRcdGcuc2V0QXR0cmlidXRlKFxyXG5cdFx0XHRcdFwiY29sb3JcIixcclxuXHRcdFx0XHRuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKG5ldyBGbG9hdDMyQXJyYXkoY29sb3JfZGF0YSksIHRoaXMudmVydGV4X2NvbXBvbmVudF9pbmZvLmNvbG9yKVxyXG5cdFx0XHQpO1xyXG5cdFx0XHRnLnNldEluZGV4KFswLCAxLCAyLCAyLCAxLCAzXSk7XHJcblx0XHRcdHJldHVybiBnO1xyXG5cdFx0fTtcclxuXHRcdC8vIHJpZ2h0XHJcblx0XHR0aGlzLmdlby5yaWdodCA9IGdlbkZhY2UoXHJcblx0XHRcdFtcclxuXHRcdFx0XHRbMSwgMCwgMV0sXHJcblx0XHRcdFx0WzEsIDAsIDBdLFxyXG5cdFx0XHRcdFsxLCAxLCAxXSxcclxuXHRcdFx0XHRbMSwgMSwgMF0sXHJcblx0XHRcdF0sXHJcblx0XHRcdHRoaXMudXZfaW5mbyxcclxuXHRcdFx0dGhpcy5mYWNlX2luZm8ucmlnaHQubm9ybWFsXHJcblx0XHQpO1xyXG5cdFx0Ly8gbGVmdFxyXG5cdFx0dGhpcy5nZW8ubGVmdCA9IGdlbkZhY2UoXHJcblx0XHRcdFtcclxuXHRcdFx0XHRbMCwgMCwgMF0sXHJcblx0XHRcdFx0WzAsIDAsIDFdLFxyXG5cdFx0XHRcdFswLCAxLCAwXSxcclxuXHRcdFx0XHRbMCwgMSwgMV0sXHJcblx0XHRcdF0sXHJcblx0XHRcdHRoaXMudXZfaW5mbyxcclxuXHRcdFx0dGhpcy5mYWNlX2luZm8ubGVmdC5ub3JtYWxcclxuXHRcdCk7XHJcblx0XHQvLyB0b3BcclxuXHRcdHRoaXMuZ2VvLnRvcCA9IGdlbkZhY2UoXHJcblx0XHRcdFtcclxuXHRcdFx0XHRbMCwgMSwgMV0sXHJcblx0XHRcdFx0WzEsIDEsIDFdLFxyXG5cdFx0XHRcdFswLCAxLCAwXSxcclxuXHRcdFx0XHRbMSwgMSwgMF0sXHJcblx0XHRcdF0sXHJcblx0XHRcdHRoaXMudXZfaW5mbyxcclxuXHRcdFx0dGhpcy5mYWNlX2luZm8udG9wLm5vcm1hbFxyXG5cdFx0KTtcclxuXHRcdC8vIGJvdHRvbVxyXG5cdFx0dGhpcy5nZW8uYm90dG9tID0gZ2VuRmFjZShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFswLCAwLCAwXSxcclxuXHRcdFx0XHRbMSwgMCwgMF0sXHJcblx0XHRcdFx0WzAsIDAsIDFdLFxyXG5cdFx0XHRcdFsxLCAwLCAxXSxcclxuXHRcdFx0XSxcclxuXHRcdFx0dGhpcy51dl9pbmZvLFxyXG5cdFx0XHR0aGlzLmZhY2VfaW5mby5ib3R0b20ubm9ybWFsXHJcblx0XHQpO1xyXG5cdFx0Ly8gZnJvbnRcclxuXHRcdHRoaXMuZ2VvLmZyb250ID0gZ2VuRmFjZShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFswLCAwLCAxXSxcclxuXHRcdFx0XHRbMSwgMCwgMV0sXHJcblx0XHRcdFx0WzAsIDEsIDFdLFxyXG5cdFx0XHRcdFsxLCAxLCAxXSxcclxuXHRcdFx0XSxcclxuXHRcdFx0dGhpcy51dl9pbmZvLFxyXG5cdFx0XHR0aGlzLmZhY2VfaW5mby5mcm9udC5ub3JtYWxcclxuXHRcdCk7XHJcblx0XHQvLyBiYWNrXHJcblx0XHR0aGlzLmdlby5iYWNrID0gZ2VuRmFjZShcclxuXHRcdFx0W1xyXG5cdFx0XHRcdFsxLCAwLCAwXSxcclxuXHRcdFx0XHRbMCwgMCwgMF0sXHJcblx0XHRcdFx0WzEsIDEsIDBdLFxyXG5cdFx0XHRcdFswLCAxLCAwXSxcclxuXHRcdFx0XSxcclxuXHRcdFx0dGhpcy51dl9pbmZvLFxyXG5cdFx0XHR0aGlzLmZhY2VfaW5mby5iYWNrLm5vcm1hbFxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdGdlblNwYXJzZVZveGVsKHNpZGVzLCB4LCB5LCB6LCB0eXBlKSB7XHJcblx0XHRsZXQgc2lkZV9tZXNoZXMgPSBbXTtcclxuXHJcblx0XHRpZiAoc2lkZXNbMF0pIHNpZGVfbWVzaGVzLnB1c2godGhpcy5nZW8ucmlnaHQuY2xvbmUoKSk7XHJcblx0XHRpZiAoc2lkZXNbMV0pIHNpZGVfbWVzaGVzLnB1c2godGhpcy5nZW8ubGVmdC5jbG9uZSgpKTtcclxuXHRcdGlmIChzaWRlc1syXSkgc2lkZV9tZXNoZXMucHVzaCh0aGlzLmdlby50b3AuY2xvbmUoKSk7XHJcblx0XHRpZiAoc2lkZXNbM10pIHNpZGVfbWVzaGVzLnB1c2godGhpcy5nZW8uYm90dG9tLmNsb25lKCkpO1xyXG5cdFx0aWYgKHNpZGVzWzRdKSBzaWRlX21lc2hlcy5wdXNoKHRoaXMuZ2VvLmZyb250LmNsb25lKCkpO1xyXG5cdFx0aWYgKHNpZGVzWzVdKSBzaWRlX21lc2hlcy5wdXNoKHRoaXMuZ2VvLmJhY2suY2xvbmUoKSk7XHJcblxyXG5cdFx0bGV0IGcgPSBUSFJFRS5CdWZmZXJHZW9tZXRyeVV0aWxzLm1lcmdlQnVmZmVyR2VvbWV0cmllcyhzaWRlX21lc2hlcyk7XHJcblx0XHRnLnNldEF0dHJpYnV0ZShcclxuXHRcdFx0XCJjb2xvclwiLFxyXG5cdFx0XHRuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKFxyXG5cdFx0XHRcdG5ldyBGbG9hdDMyQXJyYXkobmV3IEFycmF5KDQgKiBzaWRlX21lc2hlcy5sZW5ndGgpLmZpbGwodHlwZS5jb2xvcikuZmxhdE1hcCgoeCkgPT4geCkpLFxyXG5cdFx0XHRcdHRoaXMudmVydGV4X2NvbXBvbmVudF9pbmZvLmNvbG9yXHJcblx0XHRcdClcclxuXHRcdCk7XHJcblx0XHRnLnRyYW5zbGF0ZSh4LCB5LCB6KTtcclxuXHRcdHJldHVybiBnO1xyXG5cdH1cclxufVxyXG5cclxuQUZSQU1FLnJlZ2lzdGVyR2VvbWV0cnkoXCJ0ZXN0Z2VuXCIsIHtcclxuXHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHQvLyBUSFJFRS5CdWZmZXJHZW9tZXRyeVV0aWxzLm1lcmdlQnVmZmVyR2VvbWV0cmllcyh2b3gpO1xyXG5cdFx0Ly8gbGV0IGEgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgxLCAxKTtcclxuXHRcdC8vIGxldCBlID0gW107XHJcblx0XHQvLyBlLnB1c2goYSk7XHJcblx0XHQvLyBsZXQgYWEgPSBhLmNsb25lKCk7XHJcblx0XHQvLyBhYS50cmFuc2xhdGUoMSwgMCwgMSk7XHJcblx0XHQvLyBlLnB1c2goYWEpO1xyXG5cdFx0bGV0IHZveGVsID0gVm94ZWxHZW4uZ2VuRnVsbFZveGVsKDAsIDAsIDApO1xyXG5cdFx0dGhpcy5nZW9tZXRyeSA9IHZveGVsO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuQUZSQU1FLnJlZ2lzdGVyR2VvbWV0cnkoXCJtYXBcIiwge1xyXG5cdGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbnN0IGNtID0gbmV3IENodW5raW5nTWFuYWdlcigpO1xyXG5cdFx0Y20ucmVxdWVzdENodW5rKDAsIDAsIDApO1xyXG5cdFx0bGV0IGNodW5rZ2VuID0gbmV3IENodW5rR2VuKHVuZGVmaW5lZCwgMTYpO1xyXG5cdFx0Ly8gbGV0IGNodW5rID0gY2h1bmtnZW4uZ2VuZXJhdGVDaHVuaygwLCAwLCAwKTtcclxuXHRcdGxldCBjaHVuayA9IENodW5rR2VuLmdldE1vY2tDaHVuaygpO1xyXG5cdFx0bGV0IHZtYiA9IG5ldyBWb3hlbE1lc2hCdWlsZGVyKCk7XHJcblx0XHRsZXQgbWVzaCA9IHZtYi5jb25zdHJ1Y3RDaHVuayhjaHVuayk7XHJcblx0XHR0aGlzLmdlb21ldHJ5ID0gbWVzaDtcclxuXHR9LFxyXG59KTtcclxuXHJcbmNvbnN0IEJMT0NLID0ge1xyXG5cdEJUXzE6IHsgY29sb3I6IFswLCAwLCAwXSB9LFxyXG5cdEJUXzI6IHsgY29sb3I6IFswLCAwLCAwLjVdIH0sXHJcblx0QlRfMzogeyBjb2xvcjogWzAsIDEsIDBdIH0sXHJcblx0QlRfNDogeyBjb2xvcjogWzAsIDEsIDFdIH0sXHJcblx0QlRfNTogeyBjb2xvcjogWzEsIDAsIDBdIH0sXHJcblx0QlRfNjogeyBjb2xvcjogWzEsIDAsIDFdIH0sXHJcblx0QlRfNzogeyBjb2xvcjogWzEsIDEsIDBdIH0sXHJcblx0QlRfODogeyBjb2xvcjogWzEsIDEsIDFdIH0sXHJcblx0QkxBQ0s6IHsgY29sb3I6IFswLCAwLCAwXSB9LFxyXG5cdFJFRDogeyBjb2xvcjogWzEsIDAsIDBdIH0sXHJcblx0QkxVRTogeyBjb2xvcjogWzAsIDAsIDFdIH0sXHJcbn07XHJcbmNvbnN0IGJsb2NrQXJyYXkgPSBbXHJcblx0QkxPQ0suQlRfMSxcclxuXHRCTE9DSy5CVF8yLFxyXG5cdEJMT0NLLkJUXzMsXHJcblx0QkxPQ0suQlRfNCxcclxuXHRCTE9DSy5CVF81LFxyXG5cdEJMT0NLLkJUXzYsXHJcblx0QkxPQ0suQlRfNyxcclxuXHRCTE9DSy5CVF84LFxyXG5dO1xyXG5cclxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiY2h1bmstbG9hZGVyLWFjdG9yXCIsIHtcclxuXHRzY2hlbWE6IHtcclxuXHRcdHJhbmdlOiB7IHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDE2IH0sXHJcblx0fSxcclxuXHRpbml0OiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLnRpY2sgPSBBRlJBTUUudXRpbHMudGhyb3R0bGVUaWNrKHRoaXMudGljaywgNTAwLCB0aGlzKTtcclxuXHRcdGNvbnN0IGNtID0gQ2h1bmtpbmdNYW5hZ2VyKCk7XHJcblx0fSxcclxuXHR0aWNrOiBmdW5jdGlvbiAodCwgZHQpIHtcclxuXHRcdHRoaXMuZWwucG9zaXRpb24oKTtcclxuXHR9LFxyXG59KTtcclxuXHJcbmNsYXNzIFZveGVsTWVzaEJ1aWxkZXIge1xyXG5cdGNvbnN0cnVjdG9yKCkge1xyXG5cdFx0dGhpcy5idWlsZGVyID0gbmV3IFZveGVsR2VuKCk7XHJcblx0fVxyXG5cdC8qKiBnZW5lcmF0ZXMgYSBjaHVuayBtZXNoIHdpdGggZ2l2ZW4gY2h1bmsgKi9cclxuXHRjb25zdHJ1Y3RDaHVuayhjaHVuaykge1xyXG5cdFx0bGV0IGJsb2NrTWFwID0gdGhpcy5fY2h1bmtEYXRhVG9CbG9ja01hcChjaHVuay5kYXRhKTtcclxuXHRcdGxldCBiZyA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaHVuay5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdGNvbnN0IGJsb2NrID0gY2h1bmsuZGF0YVtpXTtcclxuXHRcdFx0Ly8gWFAgWE4gIFlQICBZTiAgWlAgIFpOXHJcblxyXG5cdFx0XHRjb25zdCBzaWRlcyA9IFtcclxuXHRcdFx0XHR0aGlzLl9jaGVja1NpZGVzKGJsb2NrTWFwLCBibG9jay54ICsgMSwgYmxvY2sueSwgYmxvY2sueiksXHJcblx0XHRcdFx0dGhpcy5fY2hlY2tTaWRlcyhibG9ja01hcCwgYmxvY2sueCAtIDEsIGJsb2NrLnksIGJsb2NrLnopLFxyXG5cdFx0XHRcdHRoaXMuX2NoZWNrU2lkZXMoYmxvY2tNYXAsIGJsb2NrLngsIGJsb2NrLnkgKyAxLCBibG9jay56KSxcclxuXHRcdFx0XHR0aGlzLl9jaGVja1NpZGVzKGJsb2NrTWFwLCBibG9jay54LCBibG9jay55IC0gMSwgYmxvY2sueiksXHJcblx0XHRcdFx0dGhpcy5fY2hlY2tTaWRlcyhibG9ja01hcCwgYmxvY2sueCwgYmxvY2sueSwgYmxvY2sueiArIDEpLFxyXG5cdFx0XHRcdHRoaXMuX2NoZWNrU2lkZXMoYmxvY2tNYXAsIGJsb2NrLngsIGJsb2NrLnksIGJsb2NrLnogLSAxKSxcclxuXHRcdFx0XTtcclxuXHRcdFx0aWYgKCFzaWRlcy5zb21lKCh4KSA9PiB4ID09IHRydWUpKSBjb250aW51ZTtcclxuXHRcdFx0bGV0IHZveGVsID0gdGhpcy5idWlsZGVyLmdlblNwYXJzZVZveGVsKHNpZGVzLCBibG9jay54LCBibG9jay55LCBibG9jay56LCBibG9jay50KTtcclxuXHJcblx0XHRcdGJnLnB1c2godm94ZWwpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFRIUkVFLkJ1ZmZlckdlb21ldHJ5VXRpbHMubWVyZ2VCdWZmZXJHZW9tZXRyaWVzKGJnKTtcclxuXHR9XHJcblx0X2NoZWNrU2lkZXMoYmxvY2tNYXAsIHgsIHksIHopIHtcclxuXHRcdGxldCBjID0gdGhpcy5fZ2VuM0RLZXkoeCwgeSwgeik7XHJcblx0XHRpZiAoIWJsb2NrTWFwLmhhcyhjKSkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9XHJcblx0LyoqIGdlbmVyYXRlcyBibG9ja21hcCBmcm9tIGNodW5rZGF0YSAqL1xyXG5cdF9jaHVua0RhdGFUb0Jsb2NrTWFwKGFycmF5KSB7XHJcblx0XHRsZXQgbSA9IG5ldyBNYXAoKTtcclxuXHRcdGZvciAobGV0IGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspXHJcblx0XHRcdG0uc2V0KHRoaXMuX2dlbjNES2V5KGFycmF5W2ldLngsIGFycmF5W2ldLnksIGFycmF5W2ldLnopLCBmYWxzZSk7XHJcblx0XHRyZXR1cm4gbTtcclxuXHR9XHJcblx0LyoqIGdlbmVyYXRlcyBhIGtleSBmcm9tIDNEIGNvb3JkcyAqL1xyXG5cdF9nZW4zREtleSh4LCB5LCB6KSB7XHJcblx0XHRyZXR1cm4gYCR7eH0tJHt5fS0ke3p9YDtcclxuXHR9XHJcbn1cclxuXHJcbmNsYXNzIENodW5raW5nTWFuYWdlciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHR0aGlzLmNodW5rcyA9IG5ldyBNYXAoKTtcclxuXHRcdHRoaXMuYnVpbGRlciA9IG5ldyBWb3hlbE1lc2hCdWlsZGVyKCk7XHJcblx0fVxyXG5cdGFkZENodW5rKGNodW5rKSB7XHJcblx0XHR0aGlzLmNodW5rcy5zZXQodGhpcy5fZ2VuM0RLZXkoY2h1bmsueCwgY2h1bmsueSwgY2h1bmsueiksIGNodW5rKTtcclxuXHR9XHJcblx0cmVtb3ZlQ2h1bmsoY2h1bmtLZXkpIHtcclxuXHRcdGNvbnNvbGUubG9nKGBSZW1vdmluZyBDaHVuayAke3h9LSR7eX0tJHt6fWApO1xyXG5cdFx0Ly90b2RvIHJlbW92ZSBjaHVua1xyXG5cdFx0dGhpcy5jaHVua3MuZGVsZXRlKGNodW5rS2V5KTtcclxuXHR9XHJcblx0LyoqIGxvYWRzIGEgY2h1bmsgaW50byB0aGUgc2NlbmUgKi9cclxuXHRsb2FkQ2h1bmsoY2h1bmtLZXkpIHtcclxuXHRcdC8vdG9kbyByZW1vdmUgY2h1bmtcclxuXHRcdGNvbnNvbGUubG9nKGBMb2FkaW5nIENodW5rICR7Y2h1bmtLZXl9YCk7XHJcblx0fVxyXG5cdC8qKiByZXF1ZXN0IGEgY2h1bmsgZnJvbSB0aGUgU2VydmVyICovXHJcblx0dW5sb2FkQ2h1bmsoY2h1bmtLZXkpIHtcclxuXHRcdC8vdG9kbyB1bmxvYWQgdGhlIGNodW5rXHJcblx0XHQvL3RvZG8gcmVtb3ZlIGl0IGZyb20gdGhlIG1lc2hcclxuXHRcdC8vdG9kb1xyXG5cdFx0Y29uc29sZS5sb2coYFVubG9hZGluZyBDaHVuayAke2NodW5rS2V5fWApO1xyXG5cdH1cclxuXHQvKiogcmVxdWVzdCBhIGNodW5rIGZyb20gdGhlIFNlcnZlciAqL1xyXG5cdHJlcXVlc3RDaHVuayh4LCB5LCB6KSB7XHJcblx0XHRjb25zb2xlLmxvZyhgUmVxdWVzdGluZyBDaHVuayAke3h9LSR7eX0tJHt6fWApO1xyXG5cdFx0Ly90b2RvIHJlcXVlc3QgY2h1bmsgZnJvbSBzZXJ2ZXJcclxuXHRcdGxldCBjaHVuayA9IENodW5rR2VuLmdldE1vY2tDaHVuayh4LCB5LCB6KTtcclxuXHRcdC8vdG9kbyBnZXQgY2h1bmtkYXRhXHJcblx0XHQvL3RvZG8gY29uc3RydWN0IGNodW5rXHJcblx0XHR0aGlzLmJ1aWxkZXIuY29uc3RydWN0Q2h1bmsoY2h1bmspO1xyXG5cdH1cclxuXHQvKiogZ2VuZXJhdGVzIGEga2V5IGZyb20gM0QgY29vcmRzICovXHJcblx0X2dlbjNES2V5KHgsIHksIHopIHtcclxuXHRcdHJldHVybiBgJHt4fS0ke3l9LSR7en1gO1xyXG5cdH1cclxufVxyXG5cclxuY2xhc3MgQ2h1bmtHZW4ge1xyXG5cdGNvbnN0cnVjdG9yKHRleF9kZWYsIGNodW5rc2l6ZSkge1xyXG5cdFx0dGhpcy50ZXhfZGVmID0gdGV4X2RlZiA/PyB7fTtcclxuXHRcdHRoaXMuY2h1bmtzaXplID0gY2h1bmtzaXplID8/IDE2O1xyXG5cdH1cclxuXHJcblx0Z2VuZXJhdGVDaHVuayh4LCB5LCB6KSB7XHJcblx0XHRsZXQgY2h1bmsgPSBbXTtcclxuXHRcdGZvciAobGV0IHggPSAwOyB4IDwgMTY7IHgrKykge1xyXG5cdFx0XHRmb3IgKGxldCB5ID0gMDsgeSA8IDE2OyB5KyspIHtcclxuXHRcdFx0XHRmb3IgKGxldCB6ID0gMDsgeiA8IDE2OyB6KyspIHtcclxuXHRcdFx0XHRcdGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSBjaHVuay5wdXNoKHsgeDogeCwgeTogeSwgejogeiB9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJhdGlvOiBjaHVuay5sZW5ndGggLyBNYXRoLnBvdyh0aGlzLmNodW5rc2l6ZSwgMyksXHJcblx0XHRcdGRhdGE6IGNodW5rLFxyXG5cdFx0fTtcclxuXHR9XHJcblx0c3RhdGljIGdldE1vY2tDaHVuaygpIHtcclxuXHRcdGxldCBjaHVuayA9IFtdO1xyXG5cdFx0Zm9yIChsZXQgeCA9IDA7IHggPCAxNjsgeCsrKSB7XHJcblx0XHRcdGZvciAobGV0IHkgPSAwOyB5IDwgMTY7IHkrKykge1xyXG5cdFx0XHRcdGZvciAobGV0IHogPSAwOyB6IDwgMTY7IHorKykge1xyXG5cdFx0XHRcdFx0aWYgKE1hdGgucmFuZG9tKCkgPiAwLjUpIHtcclxuXHRcdFx0XHRcdFx0Y2h1bmsucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0eDogeCxcclxuXHRcdFx0XHRcdFx0XHR5OiB5LFxyXG5cdFx0XHRcdFx0XHRcdHo6IHosXHJcblx0XHRcdFx0XHRcdFx0dDogYmxvY2tBcnJheVtNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMCkgJSBibG9ja0FycmF5Lmxlbmd0aCldLFxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHJhdGlvOiBjaHVuay5sZW5ndGggLyBNYXRoLnBvdygxNiwgMyksXHJcblx0XHRcdGRhdGE6IGNodW5rLFxyXG5cdFx0fTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGNsYXNzIENodW5rZXIge1xyXG4vLyBcdGNvbnN0cnVjdG9yKCkge31cclxuLy8gXHRyZXF1ZXN0Q2h1bmsoeCwgeSwgeikge1xyXG4vLyBcdFx0Y29uc29sZS5sb2coYFJlcXVlc3RpbmcgQ2h1bmsgJHt4fS0ke3l9LSR7en1gKVxyXG4vLyBcdFx0Ly8gcmVxdWVzdCBjaHVuayBmcm9tIHNlcnZlclxyXG4vLyBcdFx0Ly8gZ2V0IGNodW5rZGF0YVxyXG4vLyBcdFx0Ly8gY29uc3RydWN0IGNodW5rXHJcbi8vIFx0fVxyXG4vLyBcdGxvYWRDaHVuayhjaHVua0tleSkge1xyXG4vLyBcdFx0Y29uc29sZS5sb2coYExvYWRpbmcgQ2h1bmsgJHtjaHVua0tleX1gKVxyXG4vLyBcdH1cclxuLy8gXHR1bmxvYWRDaHVuayhjaHVua0tleSkge1xyXG4vLyBcdFx0Y29uc29sZS5sb2coYFVubG9hZGluZyBDaHVuayAke2NodW5rS2V5fWApXHJcbi8vIFx0fVxyXG4vLyB9XHJcblxyXG4vLyBDaHVua0dlbiAtPiBDaHVuazxWb3hlbERhdGE+IC0+IG1lc2ggZ2VuZXJhdG9yXHJcblxyXG4vLyBub2lzZSAtPiBzaW1wbGV4KENvbnRpbmVudGFsIG5vaXNlKVxyXG4vLyBTSEFQRVxyXG4vLyAtIENPTlRJTkVOVEFMIE1BUFxyXG4vLyAtIEVST1NJT04gTUFQXHJcbi8vIC0gSElMTFMmVkFMTEVZUyBNQVBcclxuLy8gQ0FWRVxyXG4vLyAtIGNhdmUgbWFwP1xyXG4vLyBCSU9NRVxyXG4vLyAtIFRFTVBFUkFUVVJFIE1BUFxyXG4vLyAtIEhVTUlESVRZIE1BUFxyXG4iLCJjb25zdCBWRVJURVhfU0hBREVSID0gW1xyXG5cdGBwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtgLFxyXG5cdGBhdHRyaWJ1dGUgdmVjMyBwb3NpdGlvbjtgLFxyXG5cdGBhdHRyaWJ1dGUgdmVjMyBub3JtYWw7YCxcclxuXHRgYXR0cmlidXRlIHZlYzIgdXY7YCxcclxuXHRgYXR0cmlidXRlIHZlYzMgY29sb3I7YCxcclxuXHRgdW5pZm9ybSBtYXQ0IHByb2plY3Rpb25NYXRyaXg7YCxcclxuXHRgdW5pZm9ybSBtYXQ0IG1vZGVsTWF0cml4O2AsXHJcblx0YHVuaWZvcm0gbWF0NCBtb2RlbFZpZXdNYXRyaXg7YCxcclxuXHRgdmFyeWluZyB2ZWMzIHZXb3JsZFBvc2l0aW9uO2AsXHJcblx0YHZhcnlpbmcgdmVjMiB2VXY7YCxcclxuXHRgdmFyeWluZyB2ZWMzIHZOb3JtYWw7YCxcclxuXHRgdmFyeWluZyB2ZWMzIHZDb2xvcjtgLFxyXG5cdGB2b2lkIG1haW4oKXtgLFxyXG5cdGAgdlV2ID0gdXY7YCxcclxuXHRgIHZOb3JtYWwgPSBub3JtYWw7YCxcclxuXHRgXHR2Q29sb3IgPSBjb2xvcjtgLFxyXG5cdGBcdHZXb3JsZFBvc2l0aW9uID0gKG1vZGVsTWF0cml4ICogdmVjNChwb3NpdGlvbiwgMS4wKSkueHl6O2AsXHJcblx0YCBnbF9Qb3NpdGlvbiA9IHByb2plY3Rpb25NYXRyaXggKiBtb2RlbFZpZXdNYXRyaXggKiB2ZWM0KHBvc2l0aW9uLCAxLjApO2AsXHJcblx0YH1gLFxyXG5dLmpvaW4oXCJcXG5cIik7XHJcblxyXG5jb25zdCBGUkFHTUVOVF9TSEFERVIgPSBgXHJcbnByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xyXG5cclxuZmxvYXQgaGFzaDEoIGZsb2F0IG4gKVxyXG57XHJcbiAgICByZXR1cm4gZnJhY3QoIG4qMTcuMCpmcmFjdCggbiowLjMxODMwOTkgKSApO1xyXG59XHJcblxyXG52ZWM0IG5vaXNlZCggaW4gdmVjMyB4IClcclxue1xyXG4gICAgdmVjMyBwID0gZmxvb3IoeCk7XHJcbiAgICB2ZWMzIHcgPSBmcmFjdCh4KTtcclxuICAgIFxyXG4gICAgdmVjMyB1ID0gdyp3KncqKHcqKHcqNi4wLTE1LjApKzEwLjApO1xyXG4gICAgdmVjMyBkdSA9IDMwLjAqdyp3Kih3Kih3LTIuMCkrMS4wKTtcclxuXHJcbiAgICBmbG9hdCBuID0gcC54ICsgMzE3LjAqcC55ICsgMTU3LjAqcC56O1xyXG4gICAgXHJcbiAgICBmbG9hdCBhID0gaGFzaDEobiswLjApO1xyXG4gICAgZmxvYXQgYiA9IGhhc2gxKG4rMS4wKTtcclxuICAgIGZsb2F0IGMgPSBoYXNoMShuKzMxNy4wKTtcclxuICAgIGZsb2F0IGQgPSBoYXNoMShuKzMxOC4wKTtcclxuICAgIGZsb2F0IGUgPSBoYXNoMShuKzE1Ny4wKTtcclxuXHRcdGZsb2F0IGYgPSBoYXNoMShuKzE1OC4wKTtcclxuICAgIGZsb2F0IGcgPSBoYXNoMShuKzQ3NC4wKTtcclxuICAgIGZsb2F0IGggPSBoYXNoMShuKzQ3NS4wKTtcclxuXHJcbiAgICBmbG9hdCBrMCA9ICAgYTtcclxuICAgIGZsb2F0IGsxID0gICBiIC0gYTtcclxuICAgIGZsb2F0IGsyID0gICBjIC0gYTtcclxuICAgIGZsb2F0IGszID0gICBlIC0gYTtcclxuICAgIGZsb2F0IGs0ID0gICBhIC0gYiAtIGMgKyBkO1xyXG4gICAgZmxvYXQgazUgPSAgIGEgLSBjIC0gZSArIGc7XHJcbiAgICBmbG9hdCBrNiA9ICAgYSAtIGIgLSBlICsgZjtcclxuICAgIGZsb2F0IGs3ID0gLSBhICsgYiArIGMgLSBkICsgZSAtIGYgLSBnICsgaDtcclxuXHJcbiAgICByZXR1cm4gdmVjNCggLTEuMCsyLjAqKGswICsgazEqdS54ICsgazIqdS55ICsgazMqdS56ICsgazQqdS54KnUueSArIGs1KnUueSp1LnogKyBrNip1LnoqdS54ICsgazcqdS54KnUueSp1LnopLCBcclxuICAgICAgICAgICAgICAgICAgICAgIDIuMCogZHUgKiB2ZWMzKCBrMSArIGs0KnUueSArIGs2KnUueiArIGs3KnUueSp1LnosXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgazIgKyBrNSp1LnogKyBrNCp1LnggKyBrNyp1LnoqdS54LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGszICsgazYqdS54ICsgazUqdS55ICsgazcqdS54KnUueSApICk7XHJcbn1cclxuXHJcbnVuaWZvcm0gbWF0NCB2aWV3TWF0cml4O1xyXG51bmlmb3JtIHZlYzMgY2FtZXJhUG9zaXRpb247XHJcbnZhcnlpbmcgdmVjMyB2V29ybGRQb3NpdGlvbjtcclxudmFyeWluZyB2ZWMyIHZVdjtcclxudmFyeWluZyB2ZWMzIHZOb3JtYWw7XHJcbnZhcnlpbmcgdmVjMyB2Q29sb3I7XHJcblxyXG51bmlmb3JtIGZsb2F0IGFtYmllbnRMaWdodENvbG9yO1xyXG5cclxuXHJcbnZvaWQgbWFpbigpIHtcclxuXHR2ZWM0IG91dENvbG9yID0gdmVjNCh2Q29sb3IueHl6LCAxLjApO1xyXG4gIGdsX0ZyYWdDb2xvciA9IG91dENvbG9yO1xyXG59XHJcbmA7XHJcblxyXG52YXIgcHJvcGVydHlUb1RocmVlTWFwcGluZyA9IHtcclxuXHRhcnJheTogXCJ2M1wiLFxyXG5cdGNvbG9yOiBcInYzXCIsXHJcblx0aW50OiBcImlcIixcclxuXHRudW1iZXI6IFwiZlwiLFxyXG5cdG1hcDogXCJ0XCIsXHJcblx0dGltZTogXCJmXCIsXHJcblx0dmVjMjogXCJ2MlwiLFxyXG5cdHZlYzM6IFwidjNcIixcclxuXHR2ZWM0OiBcInY0XCIsXHJcbn07XHJcblxyXG5jb25zdCBwb2ludFNoYWRlclZlcnQgPSBgdW5pZm9ybSBmbG9hdCBzaXplO1xyXG51bmlmb3JtIGZsb2F0IHNjYWxlO1xyXG5cclxuI2RlZmluZSBQSSAzLjE0MTU5MjY1MzU4OTc5M1xyXG4jZGVmaW5lIFBJMiA2LjI4MzE4NTMwNzE3OTU4NlxyXG4jZGVmaW5lIFBJX0hBTEYgMS41NzA3OTYzMjY3OTQ4OTY2XHJcbiNkZWZpbmUgUkVDSVBST0NBTF9QSSAwLjMxODMwOTg4NjE4Mzc5MDdcclxuI2RlZmluZSBSRUNJUFJPQ0FMX1BJMiAwLjE1OTE1NDk0MzA5MTg5NTM1XHJcbiNkZWZpbmUgRVBTSUxPTiAxZS02XHJcbiNpZm5kZWYgc2F0dXJhdGVcclxuLy8gPHRvbmVtYXBwaW5nX3BhcnNfZnJhZ21lbnQ+IG1heSBoYXZlIGRlZmluZWQgc2F0dXJhdGUoKSBhbHJlYWR5XHJcbiNkZWZpbmUgc2F0dXJhdGUoIGEgKSBjbGFtcCggYSwgMC4wLCAxLjAgKVxyXG4jZW5kaWZcclxuI2RlZmluZSB3aGl0ZUNvbXBsZW1lbnQoIGEgKSAoIDEuMCAtIHNhdHVyYXRlKCBhICkgKVxyXG5mbG9hdCBwb3cyKCBjb25zdCBpbiBmbG9hdCB4ICkgeyByZXR1cm4geCp4OyB9XHJcbnZlYzMgcG93MiggY29uc3QgaW4gdmVjMyB4ICkgeyByZXR1cm4geCp4OyB9XHJcbmZsb2F0IHBvdzMoIGNvbnN0IGluIGZsb2F0IHggKSB7IHJldHVybiB4KngqeDsgfVxyXG5mbG9hdCBwb3c0KCBjb25zdCBpbiBmbG9hdCB4ICkgeyBmbG9hdCB4MiA9IHgqeDsgcmV0dXJuIHgyKngyOyB9XHJcbmZsb2F0IG1heDMoIGNvbnN0IGluIHZlYzMgdiApIHsgcmV0dXJuIG1heCggbWF4KCB2LngsIHYueSApLCB2LnogKTsgfVxyXG5mbG9hdCBhdmVyYWdlKCBjb25zdCBpbiB2ZWMzIHYgKSB7IHJldHVybiBkb3QoIHYsIHZlYzMoIDAuMzMzMzMzMyApICk7IH1cclxuLy8gZXhwZWN0cyB2YWx1ZXMgaW4gdGhlIHJhbmdlIG9mIFswLDFdeFswLDFdLCByZXR1cm5zIHZhbHVlcyBpbiB0aGUgWzAsMV0gcmFuZ2UuXHJcbi8vIGRvIG5vdCBjb2xsYXBzZSBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHBlcjogaHR0cDovL2J5dGVibGFja3NtaXRoLmNvbS9pbXByb3ZlbWVudHMtdG8tdGhlLWNhbm9uaWNhbC1vbmUtbGluZXItZ2xzbC1yYW5kLWZvci1vcGVuZ2wtZXMtMi0wL1xyXG5oaWdocCBmbG9hdCByYW5kKCBjb25zdCBpbiB2ZWMyIHV2ICkge1xyXG5cdGNvbnN0IGhpZ2hwIGZsb2F0IGEgPSAxMi45ODk4LCBiID0gNzguMjMzLCBjID0gNDM3NTguNTQ1MztcclxuXHRoaWdocCBmbG9hdCBkdCA9IGRvdCggdXYueHksIHZlYzIoIGEsYiApICksIHNuID0gbW9kKCBkdCwgUEkgKTtcclxuXHRyZXR1cm4gZnJhY3QoIHNpbiggc24gKSAqIGMgKTtcclxufVxyXG4jaWZkZWYgSElHSF9QUkVDSVNJT05cclxuXHRmbG9hdCBwcmVjaXNpb25TYWZlTGVuZ3RoKCB2ZWMzIHYgKSB7IHJldHVybiBsZW5ndGgoIHYgKTsgfVxyXG4jZWxzZVxyXG5cdGZsb2F0IHByZWNpc2lvblNhZmVMZW5ndGgoIHZlYzMgdiApIHtcclxuXHRcdGZsb2F0IG1heENvbXBvbmVudCA9IG1heDMoIGFicyggdiApICk7XHJcblx0XHRyZXR1cm4gbGVuZ3RoKCB2IC8gbWF4Q29tcG9uZW50ICkgKiBtYXhDb21wb25lbnQ7XHJcblx0fVxyXG4jZW5kaWZcclxuc3RydWN0IEluY2lkZW50TGlnaHQge1xyXG5cdHZlYzMgY29sb3I7XHJcblx0dmVjMyBkaXJlY3Rpb247XHJcblx0Ym9vbCB2aXNpYmxlO1xyXG59O1xyXG5zdHJ1Y3QgUmVmbGVjdGVkTGlnaHQge1xyXG5cdHZlYzMgZGlyZWN0RGlmZnVzZTtcclxuXHR2ZWMzIGRpcmVjdFNwZWN1bGFyO1xyXG5cdHZlYzMgaW5kaXJlY3REaWZmdXNlO1xyXG5cdHZlYzMgaW5kaXJlY3RTcGVjdWxhcjtcclxufTtcclxuc3RydWN0IEdlb21ldHJpY0NvbnRleHQge1xyXG5cdHZlYzMgcG9zaXRpb247XHJcblx0dmVjMyBub3JtYWw7XHJcblx0dmVjMyB2aWV3RGlyO1xyXG4jaWZkZWYgVVNFX0NMRUFSQ09BVFxyXG5cdHZlYzMgY2xlYXJjb2F0Tm9ybWFsO1xyXG4jZW5kaWZcclxufTtcclxudmVjMyB0cmFuc2Zvcm1EaXJlY3Rpb24oIGluIHZlYzMgZGlyLCBpbiBtYXQ0IG1hdHJpeCApIHtcclxuXHRyZXR1cm4gbm9ybWFsaXplKCAoIG1hdHJpeCAqIHZlYzQoIGRpciwgMC4wICkgKS54eXogKTtcclxufVxyXG52ZWMzIGludmVyc2VUcmFuc2Zvcm1EaXJlY3Rpb24oIGluIHZlYzMgZGlyLCBpbiBtYXQ0IG1hdHJpeCApIHtcclxuXHQvLyBkaXIgY2FuIGJlIGVpdGhlciBhIGRpcmVjdGlvbiB2ZWN0b3Igb3IgYSBub3JtYWwgdmVjdG9yXHJcblx0Ly8gdXBwZXItbGVmdCAzeDMgb2YgbWF0cml4IGlzIGFzc3VtZWQgdG8gYmUgb3J0aG9nb25hbFxyXG5cdHJldHVybiBub3JtYWxpemUoICggdmVjNCggZGlyLCAwLjAgKSAqIG1hdHJpeCApLnh5eiApO1xyXG59XHJcbm1hdDMgdHJhbnNwb3NlTWF0MyggY29uc3QgaW4gbWF0MyBtICkge1xyXG5cdG1hdDMgdG1wO1xyXG5cdHRtcFsgMCBdID0gdmVjMyggbVsgMCBdLngsIG1bIDEgXS54LCBtWyAyIF0ueCApO1xyXG5cdHRtcFsgMSBdID0gdmVjMyggbVsgMCBdLnksIG1bIDEgXS55LCBtWyAyIF0ueSApO1xyXG5cdHRtcFsgMiBdID0gdmVjMyggbVsgMCBdLnosIG1bIDEgXS56LCBtWyAyIF0ueiApO1xyXG5cdHJldHVybiB0bXA7XHJcbn1cclxuZmxvYXQgbHVtaW5hbmNlKCBjb25zdCBpbiB2ZWMzIHJnYiApIHtcclxuXHQvLyBhc3N1bWVzIHJnYiBpcyBpbiBsaW5lYXIgY29sb3Igc3BhY2Ugd2l0aCBzUkdCIHByaW1hcmllcyBhbmQgRDY1IHdoaXRlIHBvaW50XHJcblx0Y29uc3QgdmVjMyB3ZWlnaHRzID0gdmVjMyggMC4yMTI2NzI5LCAwLjcxNTE1MjIsIDAuMDcyMTc1MCApO1xyXG5cdHJldHVybiBkb3QoIHdlaWdodHMsIHJnYiApO1xyXG59XHJcbmJvb2wgaXNQZXJzcGVjdGl2ZU1hdHJpeCggbWF0NCBtICkge1xyXG5cdHJldHVybiBtWyAyIF1bIDMgXSA9PSAtIDEuMDtcclxufVxyXG52ZWMyIGVxdWlyZWN0VXYoIGluIHZlYzMgZGlyICkge1xyXG5cdC8vIGRpciBpcyBhc3N1bWVkIHRvIGJlIHVuaXQgbGVuZ3RoXHJcblx0ZmxvYXQgdSA9IGF0YW4oIGRpci56LCBkaXIueCApICogUkVDSVBST0NBTF9QSTIgKyAwLjU7XHJcblx0ZmxvYXQgdiA9IGFzaW4oIGNsYW1wKCBkaXIueSwgLSAxLjAsIDEuMCApICkgKiBSRUNJUFJPQ0FMX1BJICsgMC41O1xyXG5cdHJldHVybiB2ZWMyKCB1LCB2ICk7XHJcbn1cclxuXHJcbiNpZiBkZWZpbmVkKCBVU0VfQ09MT1JfQUxQSEEgKVxyXG5cdHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcbiNlbGlmIGRlZmluZWQoIFVTRV9DT0xPUiApIHx8IGRlZmluZWQoIFVTRV9JTlNUQU5DSU5HX0NPTE9SIClcclxuXHR2YXJ5aW5nIHZlYzMgdkNvbG9yO1xyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBVU0VfRk9HXHJcblx0dmFyeWluZyBmbG9hdCB2Rm9nRGVwdGg7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIFVTRV9NT1JQSFRBUkdFVFNcclxuXHR1bmlmb3JtIGZsb2F0IG1vcnBoVGFyZ2V0QmFzZUluZmx1ZW5jZTtcclxuXHQjaWZkZWYgTU9SUEhUQVJHRVRTX1RFWFRVUkVcclxuXHRcdHVuaWZvcm0gZmxvYXQgbW9ycGhUYXJnZXRJbmZsdWVuY2VzWyBNT1JQSFRBUkdFVFNfQ09VTlQgXTtcclxuXHRcdHVuaWZvcm0gc2FtcGxlcjJEQXJyYXkgbW9ycGhUYXJnZXRzVGV4dHVyZTtcclxuXHRcdHVuaWZvcm0gaXZlYzIgbW9ycGhUYXJnZXRzVGV4dHVyZVNpemU7XHJcblx0XHR2ZWM0IGdldE1vcnBoKCBjb25zdCBpbiBpbnQgdmVydGV4SW5kZXgsIGNvbnN0IGluIGludCBtb3JwaFRhcmdldEluZGV4LCBjb25zdCBpbiBpbnQgb2Zmc2V0ICkge1xyXG5cdFx0XHRpbnQgdGV4ZWxJbmRleCA9IHZlcnRleEluZGV4ICogTU9SUEhUQVJHRVRTX1RFWFRVUkVfU1RSSURFICsgb2Zmc2V0O1xyXG5cdFx0XHRpbnQgeSA9IHRleGVsSW5kZXggLyBtb3JwaFRhcmdldHNUZXh0dXJlU2l6ZS54O1xyXG5cdFx0XHRpbnQgeCA9IHRleGVsSW5kZXggLSB5ICogbW9ycGhUYXJnZXRzVGV4dHVyZVNpemUueDtcclxuXHRcdFx0aXZlYzMgbW9ycGhVViA9IGl2ZWMzKCB4LCB5LCBtb3JwaFRhcmdldEluZGV4ICk7XHJcblx0XHRcdHJldHVybiB0ZXhlbEZldGNoKCBtb3JwaFRhcmdldHNUZXh0dXJlLCBtb3JwaFVWLCAwICk7XHJcblx0XHR9XHJcblx0I2Vsc2VcclxuXHRcdCNpZm5kZWYgVVNFX01PUlBITk9STUFMU1xyXG5cdFx0XHR1bmlmb3JtIGZsb2F0IG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgOCBdO1xyXG5cdFx0I2Vsc2VcclxuXHRcdFx0dW5pZm9ybSBmbG9hdCBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIDQgXTtcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZmRlZiBVU0VfTE9HREVQVEhCVUZcclxuXHQjaWZkZWYgVVNFX0xPR0RFUFRIQlVGX0VYVFxyXG5cdFx0dmFyeWluZyBmbG9hdCB2RnJhZ0RlcHRoO1xyXG5cdFx0dmFyeWluZyBmbG9hdCB2SXNQZXJzcGVjdGl2ZTtcclxuXHQjZWxzZVxyXG5cdFx0dW5pZm9ybSBmbG9hdCBsb2dEZXB0aEJ1ZkZDO1xyXG5cdCNlbmRpZlxyXG4jZW5kaWZcclxuXHJcbiNpZiBOVU1fQ0xJUFBJTkdfUExBTkVTID4gMFxyXG5cdHZhcnlpbmcgdmVjMyB2Q2xpcFBvc2l0aW9uO1xyXG4jZW5kaWZcclxuXHJcbnZvaWQgbWFpbigpIHtcclxuXHJcbiAgI2lmIGRlZmluZWQoIFVTRV9DT0xPUl9BTFBIQSApXHJcblx0dkNvbG9yID0gdmVjNCggMS4wICk7XHJcbiNlbGlmIGRlZmluZWQoIFVTRV9DT0xPUiApIHx8IGRlZmluZWQoIFVTRV9JTlNUQU5DSU5HX0NPTE9SIClcclxuXHR2Q29sb3IgPSB2ZWMzKCAxLjAgKTtcclxuI2VuZGlmXHJcbiNpZmRlZiBVU0VfQ09MT1JcclxuXHR2Q29sb3IgKj0gY29sb3I7XHJcbiNlbmRpZlxyXG4jaWZkZWYgVVNFX0lOU1RBTkNJTkdfQ09MT1JcclxuXHR2Q29sb3IueHl6ICo9IGluc3RhbmNlQ29sb3IueHl6O1xyXG4jZW5kaWZcclxuXHJcblx0I2lmIGRlZmluZWQoIFVTRV9NT1JQSENPTE9SUyApICYmIGRlZmluZWQoIE1PUlBIVEFSR0VUU19URVhUVVJFIClcclxuXHQvLyBtb3JwaFRhcmdldEJhc2VJbmZsdWVuY2UgaXMgc2V0IGJhc2VkIG9uIEJ1ZmZlckdlb21ldHJ5Lm1vcnBoVGFyZ2V0c1JlbGF0aXZlIHZhbHVlOlxyXG5cdC8vIFdoZW4gbW9ycGhUYXJnZXRzUmVsYXRpdmUgaXMgZmFsc2UsIHRoaXMgaXMgc2V0IHRvIDEgLSBzdW0oaW5mbHVlbmNlcyk7IHRoaXMgcmVzdWx0cyBpbiBub3JtYWwgPSBzdW0oKHRhcmdldCAtIGJhc2UpICogaW5mbHVlbmNlKVxyXG5cdC8vIFdoZW4gbW9ycGhUYXJnZXRzUmVsYXRpdmUgaXMgdHJ1ZSwgdGhpcyBpcyBzZXQgdG8gMTsgYXMgYSByZXN1bHQsIGFsbCBtb3JwaCB0YXJnZXRzIGFyZSBzaW1wbHkgYWRkZWQgdG8gdGhlIGJhc2UgYWZ0ZXIgd2VpZ2h0aW5nXHJcblx0dkNvbG9yICo9IG1vcnBoVGFyZ2V0QmFzZUluZmx1ZW5jZTtcclxuXHRmb3IgKCBpbnQgaSA9IDA7IGkgPCBNT1JQSFRBUkdFVFNfQ09VTlQ7IGkgKysgKSB7XHJcblx0XHQjaWYgZGVmaW5lZCggVVNFX0NPTE9SX0FMUEhBIClcclxuXHRcdFx0aWYgKCBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIGkgXSAhPSAwLjAgKSB2Q29sb3IgKz0gZ2V0TW9ycGgoIGdsX1ZlcnRleElELCBpLCAyICkgKiBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIGkgXTtcclxuXHRcdCNlbGlmIGRlZmluZWQoIFVTRV9DT0xPUiApXHJcblx0XHRcdGlmICggbW9ycGhUYXJnZXRJbmZsdWVuY2VzWyBpIF0gIT0gMC4wICkgdkNvbG9yICs9IGdldE1vcnBoKCBnbF9WZXJ0ZXhJRCwgaSwgMiApLnJnYiAqIG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgaSBdO1xyXG5cdFx0I2VuZGlmXHJcblx0fVxyXG4jZW5kaWZcclxuXHJcblx0dmVjMyB0cmFuc2Zvcm1lZCA9IHZlYzMoIHBvc2l0aW9uICk7XHJcblxyXG5cdCNpZmRlZiBVU0VfTU9SUEhUQVJHRVRTXHJcblx0Ly8gbW9ycGhUYXJnZXRCYXNlSW5mbHVlbmNlIGlzIHNldCBiYXNlZCBvbiBCdWZmZXJHZW9tZXRyeS5tb3JwaFRhcmdldHNSZWxhdGl2ZSB2YWx1ZTpcclxuXHQvLyBXaGVuIG1vcnBoVGFyZ2V0c1JlbGF0aXZlIGlzIGZhbHNlLCB0aGlzIGlzIHNldCB0byAxIC0gc3VtKGluZmx1ZW5jZXMpOyB0aGlzIHJlc3VsdHMgaW4gcG9zaXRpb24gPSBzdW0oKHRhcmdldCAtIGJhc2UpICogaW5mbHVlbmNlKVxyXG5cdC8vIFdoZW4gbW9ycGhUYXJnZXRzUmVsYXRpdmUgaXMgdHJ1ZSwgdGhpcyBpcyBzZXQgdG8gMTsgYXMgYSByZXN1bHQsIGFsbCBtb3JwaCB0YXJnZXRzIGFyZSBzaW1wbHkgYWRkZWQgdG8gdGhlIGJhc2UgYWZ0ZXIgd2VpZ2h0aW5nXHJcblx0dHJhbnNmb3JtZWQgKj0gbW9ycGhUYXJnZXRCYXNlSW5mbHVlbmNlO1xyXG5cdCNpZmRlZiBNT1JQSFRBUkdFVFNfVEVYVFVSRVxyXG5cdFx0Zm9yICggaW50IGkgPSAwOyBpIDwgTU9SUEhUQVJHRVRTX0NPVU5UOyBpICsrICkge1xyXG5cdFx0XHRpZiAoIG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgaSBdICE9IDAuMCApIHRyYW5zZm9ybWVkICs9IGdldE1vcnBoKCBnbF9WZXJ0ZXhJRCwgaSwgMCApLnh5eiAqIG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgaSBdO1xyXG5cdFx0fVxyXG5cdCNlbHNlXHJcblx0XHR0cmFuc2Zvcm1lZCArPSBtb3JwaFRhcmdldDAgKiBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIDAgXTtcclxuXHRcdHRyYW5zZm9ybWVkICs9IG1vcnBoVGFyZ2V0MSAqIG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgMSBdO1xyXG5cdFx0dHJhbnNmb3JtZWQgKz0gbW9ycGhUYXJnZXQyICogbW9ycGhUYXJnZXRJbmZsdWVuY2VzWyAyIF07XHJcblx0XHR0cmFuc2Zvcm1lZCArPSBtb3JwaFRhcmdldDMgKiBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIDMgXTtcclxuXHRcdCNpZm5kZWYgVVNFX01PUlBITk9STUFMU1xyXG5cdFx0XHR0cmFuc2Zvcm1lZCArPSBtb3JwaFRhcmdldDQgKiBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIDQgXTtcclxuXHRcdFx0dHJhbnNmb3JtZWQgKz0gbW9ycGhUYXJnZXQ1ICogbW9ycGhUYXJnZXRJbmZsdWVuY2VzWyA1IF07XHJcblx0XHRcdHRyYW5zZm9ybWVkICs9IG1vcnBoVGFyZ2V0NiAqIG1vcnBoVGFyZ2V0SW5mbHVlbmNlc1sgNiBdO1xyXG5cdFx0XHR0cmFuc2Zvcm1lZCArPSBtb3JwaFRhcmdldDcgKiBtb3JwaFRhcmdldEluZmx1ZW5jZXNbIDcgXTtcclxuXHRcdCNlbmRpZlxyXG5cdCNlbmRpZlxyXG4jZW5kaWZcclxuXHJcblx0dmVjNCBtdlBvc2l0aW9uID0gdmVjNCggdHJhbnNmb3JtZWQsIDEuMCApO1xyXG4jaWZkZWYgVVNFX0lOU1RBTkNJTkdcclxuXHRtdlBvc2l0aW9uID0gaW5zdGFuY2VNYXRyaXggKiBtdlBvc2l0aW9uO1xyXG4jZW5kaWZcclxubXZQb3NpdGlvbiA9IG1vZGVsVmlld01hdHJpeCAqIG12UG9zaXRpb247XHJcbmdsX1Bvc2l0aW9uID0gcHJvamVjdGlvbk1hdHJpeCAqIG12UG9zaXRpb247XHJcblxyXG5cdGdsX1BvaW50U2l6ZSA9IHNpemU7XHJcblx0I2lmZGVmIFVTRV9TSVpFQVRURU5VQVRJT05cclxuXHRcdGJvb2wgaXNQZXJzcGVjdGl2ZSA9IGlzUGVyc3BlY3RpdmVNYXRyaXgoIHByb2plY3Rpb25NYXRyaXggKTtcclxuXHRcdGlmICggaXNQZXJzcGVjdGl2ZSApIGdsX1BvaW50U2l6ZSAqPSAoIHNjYWxlIC8gLSBtdlBvc2l0aW9uLnogKTtcclxuXHQjZW5kaWZcclxuXHJcblx0I2lmZGVmIFVTRV9MT0dERVBUSEJVRlxyXG5cdCNpZmRlZiBVU0VfTE9HREVQVEhCVUZfRVhUXHJcblx0XHR2RnJhZ0RlcHRoID0gMS4wICsgZ2xfUG9zaXRpb24udztcclxuXHRcdHZJc1BlcnNwZWN0aXZlID0gZmxvYXQoIGlzUGVyc3BlY3RpdmVNYXRyaXgoIHByb2plY3Rpb25NYXRyaXggKSApO1xyXG5cdCNlbHNlXHJcblx0XHRpZiAoIGlzUGVyc3BlY3RpdmVNYXRyaXgoIHByb2plY3Rpb25NYXRyaXggKSApIHtcclxuXHRcdFx0Z2xfUG9zaXRpb24ueiA9IGxvZzIoIG1heCggRVBTSUxPTiwgZ2xfUG9zaXRpb24udyArIDEuMCApICkgKiBsb2dEZXB0aEJ1ZkZDIC0gMS4wO1xyXG5cdFx0XHRnbF9Qb3NpdGlvbi56ICo9IGdsX1Bvc2l0aW9uLnc7XHJcblx0XHR9XHJcblx0I2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmIE5VTV9DTElQUElOR19QTEFORVMgPiAwXHJcblx0dkNsaXBQb3NpdGlvbiA9IC0gbXZQb3NpdGlvbi54eXo7XHJcbiNlbmRpZlxyXG5cclxuXHQjaWYgZGVmaW5lZCggVVNFX0VOVk1BUCApIHx8IGRlZmluZWQoIERJU1RBTkNFICkgfHwgZGVmaW5lZCAoIFVTRV9TSEFET1dNQVAgKSB8fCBkZWZpbmVkICggVVNFX1RSQU5TTUlTU0lPTiApIHx8IE5VTV9TUE9UX0xJR0hUX0NPT1JEUyA+IDBcclxuXHR2ZWM0IHdvcmxkUG9zaXRpb24gPSB2ZWM0KCB0cmFuc2Zvcm1lZCwgMS4wICk7XHJcblx0I2lmZGVmIFVTRV9JTlNUQU5DSU5HXHJcblx0XHR3b3JsZFBvc2l0aW9uID0gaW5zdGFuY2VNYXRyaXggKiB3b3JsZFBvc2l0aW9uO1xyXG5cdCNlbmRpZlxyXG5cdHdvcmxkUG9zaXRpb24gPSBtb2RlbE1hdHJpeCAqIHdvcmxkUG9zaXRpb247XHJcbiNlbmRpZlxyXG5cclxuXHQjaWZkZWYgVVNFX0ZPR1xyXG5cdHZGb2dEZXB0aCA9IC0gbXZQb3NpdGlvbi56O1xyXG4jZW5kaWZcclxufWA7XHJcbmNvbnN0IHBvaW50U2hhZGVyRnJhZyA9IGB1bmlmb3JtIHZlYzMgZGlmZnVzZTtcclxudW5pZm9ybSBmbG9hdCBvcGFjaXR5O1xyXG5cclxuI2RlZmluZSBQSSAzLjE0MTU5MjY1MzU4OTc5M1xyXG4jZGVmaW5lIFBJMiA2LjI4MzE4NTMwNzE3OTU4NlxyXG4jZGVmaW5lIFBJX0hBTEYgMS41NzA3OTYzMjY3OTQ4OTY2XHJcbiNkZWZpbmUgUkVDSVBST0NBTF9QSSAwLjMxODMwOTg4NjE4Mzc5MDdcclxuI2RlZmluZSBSRUNJUFJPQ0FMX1BJMiAwLjE1OTE1NDk0MzA5MTg5NTM1XHJcbiNkZWZpbmUgRVBTSUxPTiAxZS02XHJcbiNpZm5kZWYgc2F0dXJhdGVcclxuLy8gPHRvbmVtYXBwaW5nX3BhcnNfZnJhZ21lbnQ+IG1heSBoYXZlIGRlZmluZWQgc2F0dXJhdGUoKSBhbHJlYWR5XHJcbiNkZWZpbmUgc2F0dXJhdGUoIGEgKSBjbGFtcCggYSwgMC4wLCAxLjAgKVxyXG4jZW5kaWZcclxuI2RlZmluZSB3aGl0ZUNvbXBsZW1lbnQoIGEgKSAoIDEuMCAtIHNhdHVyYXRlKCBhICkgKVxyXG5mbG9hdCBwb3cyKCBjb25zdCBpbiBmbG9hdCB4ICkgeyByZXR1cm4geCp4OyB9XHJcbnZlYzMgcG93MiggY29uc3QgaW4gdmVjMyB4ICkgeyByZXR1cm4geCp4OyB9XHJcbmZsb2F0IHBvdzMoIGNvbnN0IGluIGZsb2F0IHggKSB7IHJldHVybiB4KngqeDsgfVxyXG5mbG9hdCBwb3c0KCBjb25zdCBpbiBmbG9hdCB4ICkgeyBmbG9hdCB4MiA9IHgqeDsgcmV0dXJuIHgyKngyOyB9XHJcbmZsb2F0IG1heDMoIGNvbnN0IGluIHZlYzMgdiApIHsgcmV0dXJuIG1heCggbWF4KCB2LngsIHYueSApLCB2LnogKTsgfVxyXG5mbG9hdCBhdmVyYWdlKCBjb25zdCBpbiB2ZWMzIHYgKSB7IHJldHVybiBkb3QoIHYsIHZlYzMoIDAuMzMzMzMzMyApICk7IH1cclxuLy8gZXhwZWN0cyB2YWx1ZXMgaW4gdGhlIHJhbmdlIG9mIFswLDFdeFswLDFdLCByZXR1cm5zIHZhbHVlcyBpbiB0aGUgWzAsMV0gcmFuZ2UuXHJcbi8vIGRvIG5vdCBjb2xsYXBzZSBpbnRvIGEgc2luZ2xlIGZ1bmN0aW9uIHBlcjogaHR0cDovL2J5dGVibGFja3NtaXRoLmNvbS9pbXByb3ZlbWVudHMtdG8tdGhlLWNhbm9uaWNhbC1vbmUtbGluZXItZ2xzbC1yYW5kLWZvci1vcGVuZ2wtZXMtMi0wL1xyXG5oaWdocCBmbG9hdCByYW5kKCBjb25zdCBpbiB2ZWMyIHV2ICkge1xyXG5cdGNvbnN0IGhpZ2hwIGZsb2F0IGEgPSAxMi45ODk4LCBiID0gNzguMjMzLCBjID0gNDM3NTguNTQ1MztcclxuXHRoaWdocCBmbG9hdCBkdCA9IGRvdCggdXYueHksIHZlYzIoIGEsYiApICksIHNuID0gbW9kKCBkdCwgUEkgKTtcclxuXHRyZXR1cm4gZnJhY3QoIHNpbiggc24gKSAqIGMgKTtcclxufVxyXG4jaWZkZWYgSElHSF9QUkVDSVNJT05cclxuXHRmbG9hdCBwcmVjaXNpb25TYWZlTGVuZ3RoKCB2ZWMzIHYgKSB7IHJldHVybiBsZW5ndGgoIHYgKTsgfVxyXG4jZWxzZVxyXG5cdGZsb2F0IHByZWNpc2lvblNhZmVMZW5ndGgoIHZlYzMgdiApIHtcclxuXHRcdGZsb2F0IG1heENvbXBvbmVudCA9IG1heDMoIGFicyggdiApICk7XHJcblx0XHRyZXR1cm4gbGVuZ3RoKCB2IC8gbWF4Q29tcG9uZW50ICkgKiBtYXhDb21wb25lbnQ7XHJcblx0fVxyXG4jZW5kaWZcclxuc3RydWN0IEluY2lkZW50TGlnaHQge1xyXG5cdHZlYzMgY29sb3I7XHJcblx0dmVjMyBkaXJlY3Rpb247XHJcblx0Ym9vbCB2aXNpYmxlO1xyXG59O1xyXG5zdHJ1Y3QgUmVmbGVjdGVkTGlnaHQge1xyXG5cdHZlYzMgZGlyZWN0RGlmZnVzZTtcclxuXHR2ZWMzIGRpcmVjdFNwZWN1bGFyO1xyXG5cdHZlYzMgaW5kaXJlY3REaWZmdXNlO1xyXG5cdHZlYzMgaW5kaXJlY3RTcGVjdWxhcjtcclxufTtcclxuc3RydWN0IEdlb21ldHJpY0NvbnRleHQge1xyXG5cdHZlYzMgcG9zaXRpb247XHJcblx0dmVjMyBub3JtYWw7XHJcblx0dmVjMyB2aWV3RGlyO1xyXG4jaWZkZWYgVVNFX0NMRUFSQ09BVFxyXG5cdHZlYzMgY2xlYXJjb2F0Tm9ybWFsO1xyXG4jZW5kaWZcclxufTtcclxudmVjMyB0cmFuc2Zvcm1EaXJlY3Rpb24oIGluIHZlYzMgZGlyLCBpbiBtYXQ0IG1hdHJpeCApIHtcclxuXHRyZXR1cm4gbm9ybWFsaXplKCAoIG1hdHJpeCAqIHZlYzQoIGRpciwgMC4wICkgKS54eXogKTtcclxufVxyXG52ZWMzIGludmVyc2VUcmFuc2Zvcm1EaXJlY3Rpb24oIGluIHZlYzMgZGlyLCBpbiBtYXQ0IG1hdHJpeCApIHtcclxuXHQvLyBkaXIgY2FuIGJlIGVpdGhlciBhIGRpcmVjdGlvbiB2ZWN0b3Igb3IgYSBub3JtYWwgdmVjdG9yXHJcblx0Ly8gdXBwZXItbGVmdCAzeDMgb2YgbWF0cml4IGlzIGFzc3VtZWQgdG8gYmUgb3J0aG9nb25hbFxyXG5cdHJldHVybiBub3JtYWxpemUoICggdmVjNCggZGlyLCAwLjAgKSAqIG1hdHJpeCApLnh5eiApO1xyXG59XHJcbm1hdDMgdHJhbnNwb3NlTWF0MyggY29uc3QgaW4gbWF0MyBtICkge1xyXG5cdG1hdDMgdG1wO1xyXG5cdHRtcFsgMCBdID0gdmVjMyggbVsgMCBdLngsIG1bIDEgXS54LCBtWyAyIF0ueCApO1xyXG5cdHRtcFsgMSBdID0gdmVjMyggbVsgMCBdLnksIG1bIDEgXS55LCBtWyAyIF0ueSApO1xyXG5cdHRtcFsgMiBdID0gdmVjMyggbVsgMCBdLnosIG1bIDEgXS56LCBtWyAyIF0ueiApO1xyXG5cdHJldHVybiB0bXA7XHJcbn1cclxuZmxvYXQgbHVtaW5hbmNlKCBjb25zdCBpbiB2ZWMzIHJnYiApIHtcclxuXHQvLyBhc3N1bWVzIHJnYiBpcyBpbiBsaW5lYXIgY29sb3Igc3BhY2Ugd2l0aCBzUkdCIHByaW1hcmllcyBhbmQgRDY1IHdoaXRlIHBvaW50XHJcblx0Y29uc3QgdmVjMyB3ZWlnaHRzID0gdmVjMyggMC4yMTI2NzI5LCAwLjcxNTE1MjIsIDAuMDcyMTc1MCApO1xyXG5cdHJldHVybiBkb3QoIHdlaWdodHMsIHJnYiApO1xyXG59XHJcbmJvb2wgaXNQZXJzcGVjdGl2ZU1hdHJpeCggbWF0NCBtICkge1xyXG5cdHJldHVybiBtWyAyIF1bIDMgXSA9PSAtIDEuMDtcclxufVxyXG52ZWMyIGVxdWlyZWN0VXYoIGluIHZlYzMgZGlyICkge1xyXG5cdC8vIGRpciBpcyBhc3N1bWVkIHRvIGJlIHVuaXQgbGVuZ3RoXHJcblx0ZmxvYXQgdSA9IGF0YW4oIGRpci56LCBkaXIueCApICogUkVDSVBST0NBTF9QSTIgKyAwLjU7XHJcblx0ZmxvYXQgdiA9IGFzaW4oIGNsYW1wKCBkaXIueSwgLSAxLjAsIDEuMCApICkgKiBSRUNJUFJPQ0FMX1BJICsgMC41O1xyXG5cdHJldHVybiB2ZWMyKCB1LCB2ICk7XHJcbn1cclxuXHJcbiNpZiBkZWZpbmVkKCBVU0VfQ09MT1JfQUxQSEEgKVxyXG5cdHZhcnlpbmcgdmVjNCB2Q29sb3I7XHJcbiNlbGlmIGRlZmluZWQoIFVTRV9DT0xPUiApXHJcblx0dmFyeWluZyB2ZWMzIHZDb2xvcjtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZCggVVNFX01BUCApIHx8IGRlZmluZWQoIFVTRV9BTFBIQU1BUCApXHJcblx0dW5pZm9ybSBtYXQzIHV2VHJhbnNmb3JtO1xyXG4jZW5kaWZcclxuI2lmZGVmIFVTRV9NQVBcclxuXHR1bmlmb3JtIHNhbXBsZXIyRCBtYXA7XHJcbiNlbmRpZlxyXG4jaWZkZWYgVVNFX0FMUEhBTUFQXHJcblx0dW5pZm9ybSBzYW1wbGVyMkQgYWxwaGFNYXA7XHJcbiNlbmRpZlxyXG5cclxuI2lmZGVmIFVTRV9BTFBIQVRFU1RcclxuXHR1bmlmb3JtIGZsb2F0IGFscGhhVGVzdDtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgVVNFX0ZPR1xyXG5cdHVuaWZvcm0gdmVjMyBmb2dDb2xvcjtcclxuXHR2YXJ5aW5nIGZsb2F0IHZGb2dEZXB0aDtcclxuXHQjaWZkZWYgRk9HX0VYUDJcclxuXHRcdHVuaWZvcm0gZmxvYXQgZm9nRGVuc2l0eTtcclxuXHQjZWxzZVxyXG5cdFx0dW5pZm9ybSBmbG9hdCBmb2dOZWFyO1xyXG5cdFx0dW5pZm9ybSBmbG9hdCBmb2dGYXI7XHJcblx0I2VuZGlmXHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoIFVTRV9MT0dERVBUSEJVRiApICYmIGRlZmluZWQoIFVTRV9MT0dERVBUSEJVRl9FWFQgKVxyXG5cdHVuaWZvcm0gZmxvYXQgbG9nRGVwdGhCdWZGQztcclxuXHR2YXJ5aW5nIGZsb2F0IHZGcmFnRGVwdGg7XHJcblx0dmFyeWluZyBmbG9hdCB2SXNQZXJzcGVjdGl2ZTtcclxuI2VuZGlmXHJcblxyXG4jaWYgTlVNX0NMSVBQSU5HX1BMQU5FUyA+IDBcclxuXHR2YXJ5aW5nIHZlYzMgdkNsaXBQb3NpdGlvbjtcclxuXHR1bmlmb3JtIHZlYzQgY2xpcHBpbmdQbGFuZXNbIE5VTV9DTElQUElOR19QTEFORVMgXTtcclxuI2VuZGlmXHJcblxyXG52b2lkIG1haW4oKSB7XHJcblxyXG4jaWYgTlVNX0NMSVBQSU5HX1BMQU5FUyA+IDBcclxuXHR2ZWM0IHBsYW5lO1xyXG5cdCNwcmFnbWEgdW5yb2xsX2xvb3Bfc3RhcnRcclxuXHRmb3IgKCBpbnQgaSA9IDA7IGkgPCBVTklPTl9DTElQUElOR19QTEFORVM7IGkgKysgKSB7XHJcblx0XHRwbGFuZSA9IGNsaXBwaW5nUGxhbmVzWyBpIF07XHJcblx0XHRpZiAoIGRvdCggdkNsaXBQb3NpdGlvbiwgcGxhbmUueHl6ICkgPiBwbGFuZS53ICkgZGlzY2FyZDtcclxuXHR9XHJcblx0I3ByYWdtYSB1bnJvbGxfbG9vcF9lbmRcclxuXHQjaWYgVU5JT05fQ0xJUFBJTkdfUExBTkVTIDwgTlVNX0NMSVBQSU5HX1BMQU5FU1xyXG5cdFx0Ym9vbCBjbGlwcGVkID0gdHJ1ZTtcclxuXHRcdCNwcmFnbWEgdW5yb2xsX2xvb3Bfc3RhcnRcclxuXHRcdGZvciAoIGludCBpID0gVU5JT05fQ0xJUFBJTkdfUExBTkVTOyBpIDwgTlVNX0NMSVBQSU5HX1BMQU5FUzsgaSArKyApIHtcclxuXHRcdFx0cGxhbmUgPSBjbGlwcGluZ1BsYW5lc1sgaSBdO1xyXG5cdFx0XHRjbGlwcGVkID0gKCBkb3QoIHZDbGlwUG9zaXRpb24sIHBsYW5lLnh5eiApID4gcGxhbmUudyApICYmIGNsaXBwZWQ7XHJcblx0XHR9XHJcblx0XHQjcHJhZ21hIHVucm9sbF9sb29wX2VuZFxyXG5cdFx0aWYgKCBjbGlwcGVkICkgZGlzY2FyZDtcclxuXHQjZW5kaWZcclxuI2VuZGlmXHJcblxyXG5cdHZlYzMgb3V0Z29pbmdMaWdodCA9IHZlYzMoIDAuMCApO1xyXG5cdHZlYzQgZGlmZnVzZUNvbG9yID0gdmVjNCggZGlmZnVzZSwgb3BhY2l0eSApO1xyXG5cclxuI2lmIGRlZmluZWQoIFVTRV9MT0dERVBUSEJVRiApICYmIGRlZmluZWQoIFVTRV9MT0dERVBUSEJVRl9FWFQgKVxyXG5cdC8vIERvaW5nIGEgc3RyaWN0IGNvbXBhcmlzb24gd2l0aCA9PSAxLjAgY2FuIGNhdXNlIG5vaXNlIGFydGlmYWN0c1xyXG5cdC8vIG9uIHNvbWUgcGxhdGZvcm1zLiBTZWUgaXNzdWUgIzE3NjIzLlxyXG5cdGdsX0ZyYWdEZXB0aEVYVCA9IHZJc1BlcnNwZWN0aXZlID09IDAuMCA/IGdsX0ZyYWdDb29yZC56IDogbG9nMiggdkZyYWdEZXB0aCApICogbG9nRGVwdGhCdWZGQyAqIDAuNTtcclxuI2VuZGlmXHJcblxyXG4jaWYgZGVmaW5lZCggVVNFX01BUCApIHx8IGRlZmluZWQoIFVTRV9BTFBIQU1BUCApXHJcblx0dmVjMiB1diA9ICggdXZUcmFuc2Zvcm0gKiB2ZWMzKCBnbF9Qb2ludENvb3JkLngsIDEuMCAtIGdsX1BvaW50Q29vcmQueSwgMSApICkueHk7XHJcbiNlbmRpZlxyXG4jaWZkZWYgVVNFX01BUFxyXG5cdGRpZmZ1c2VDb2xvciAqPSB0ZXh0dXJlMkQoIG1hcCwgdXYgKTtcclxuI2VuZGlmXHJcbiNpZmRlZiBVU0VfQUxQSEFNQVBcclxuXHRkaWZmdXNlQ29sb3IuYSAqPSB0ZXh0dXJlMkQoIGFscGhhTWFwLCB1diApLmc7XHJcbiNlbmRpZlxyXG5cclxuI2lmIGRlZmluZWQoIFVTRV9DT0xPUl9BTFBIQSApXHJcblx0ZGlmZnVzZUNvbG9yICo9IHZDb2xvcjtcclxuI2VsaWYgZGVmaW5lZCggVVNFX0NPTE9SIClcclxuXHRkaWZmdXNlQ29sb3IucmdiICo9IHZDb2xvcjtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgVVNFX0FMUEhBVEVTVFxyXG5cdGlmICggZGlmZnVzZUNvbG9yLmEgPCBhbHBoYVRlc3QgKSBkaXNjYXJkO1xyXG4jZW5kaWZcclxuXHJcblx0b3V0Z29pbmdMaWdodCA9IGRpZmZ1c2VDb2xvci5yZ2I7XHJcblxyXG4jaWZkZWYgT1BBUVVFXHJcbmRpZmZ1c2VDb2xvci5hID0gMS4wO1xyXG4jZW5kaWZcclxuLy8gaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi90aHJlZS5qcy9wdWxsLzIyNDI1XHJcbiNpZmRlZiBVU0VfVFJBTlNNSVNTSU9OXHJcbmRpZmZ1c2VDb2xvci5hICo9IG1hdGVyaWFsLnRyYW5zbWlzc2lvbkFscGhhICsgMC4xO1xyXG4jZW5kaWZcclxuZ2xfRnJhZ0NvbG9yID0gdmVjNCggb3V0Z29pbmdMaWdodCwgZGlmZnVzZUNvbG9yLmEgKTtcclxuXHJcbiNpZiBkZWZpbmVkKCBUT05FX01BUFBJTkcgKVxyXG5cdGdsX0ZyYWdDb2xvci5yZ2IgPSB0b25lTWFwcGluZyggZ2xfRnJhZ0NvbG9yLnJnYiApO1xyXG4jZW5kaWZcclxuXHJcbmdsX0ZyYWdDb2xvciA9IGxpbmVhclRvT3V0cHV0VGV4ZWwoIGdsX0ZyYWdDb2xvciApO1xyXG5cclxuI2lmZGVmIFVTRV9GT0dcclxuXHQjaWZkZWYgRk9HX0VYUDJcclxuXHRcdGZsb2F0IGZvZ0ZhY3RvciA9IDEuMCAtIGV4cCggLSBmb2dEZW5zaXR5ICogZm9nRGVuc2l0eSAqIHZGb2dEZXB0aCAqIHZGb2dEZXB0aCApO1xyXG5cdCNlbHNlXHJcblx0XHRmbG9hdCBmb2dGYWN0b3IgPSBzbW9vdGhzdGVwKCBmb2dOZWFyLCBmb2dGYXIsIHZGb2dEZXB0aCApO1xyXG5cdCNlbmRpZlxyXG5cdGdsX0ZyYWdDb2xvci5yZ2IgPSBtaXgoIGdsX0ZyYWdDb2xvci5yZ2IsIGZvZ0NvbG9yLCBmb2dGYWN0b3IgKTtcclxuI2VuZGlmXHJcblxyXG4jaWZkZWYgUFJFTVVMVElQTElFRF9BTFBIQVxyXG5cdC8vIEdldCBnZXQgbm9ybWFsIGJsZW5kaW5nIHdpdGggcHJlbXVsdGlwbGVkLCB1c2Ugd2l0aCBDdXN0b21CbGVuZGluZywgT25lRmFjdG9yLCBPbmVNaW51c1NyY0FscGhhRmFjdG9yLCBBZGRFcXVhdGlvbi5cclxuXHRnbF9GcmFnQ29sb3IucmdiICo9IGdsX0ZyYWdDb2xvci5hO1xyXG4jZW5kaWZcclxuXHJcbn1gO1xyXG5cclxuQUZSQU1FLnJlZ2lzdGVyU2hhZGVyKFwicG9pbnRzU2hhZGVyXCIsIHtcclxuXHRzY2hlbWE6IHtcclxuXHRcdC8vIGZvZ0RlbnNpdHk6IHsgdHlwZTpcIm51bWJlclwiLGlzOiBcInVuaWZvcm1cIixkZWZhdWx0OiAwLjAwMDI1IH0sXHJcblx0XHQvLyBmb2dOZWFyOiB7IHR5cGU6XCJudW1iZXJcIixpczogXCJ1bmlmb3JtXCIsZGVmYXVsdDogMSB9LFxyXG5cdFx0Ly8gZm9nRmFyOiB7IHR5cGU6XCJudW1iZXJcIixpczogXCJ1bmlmb3JtXCIsZGVmYXVsdDogMjAwMCB9LFxyXG5cdFx0Ly8gZm9nQ29sb3I6IHsgdHlwZTpcImNvbG9yXCIsaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IG5ldyBDb2xvcigweGZmZmZmZikgfSxcclxuXHRcdC8vIGRpZmZ1c2U6IHsgdHlwZTpcImNvbG9yXCIsaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IC8qQF9fUFVSRV9fKi8gbmV3IENvbG9yKDB4ZmZmZmZmKSB9LFxyXG5cdFx0Ly8gb3BhY2l0eTogeyB0eXBlOlwibnVtYmVyXCIsaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IDEuMCB9LFxyXG5cdFx0Ly8gc2l6ZTogeyB0eXBlOlwibnVtYmVyXCIsaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IDEuMCB9LFxyXG5cdFx0Ly8gc2NhbGU6IHsgdHlwZTpcIm51bWJlclwiLGlzOiBcInVuaWZvcm1cIixkZWZhdWx0OiAxLjAgfSxcclxuXHRcdC8vIG1hcDogeyBpczogXCJ1bmlmb3JtXCIsZGVmYXVsdDogbnVsbCB9LFxyXG5cdFx0Ly8gYWxwaGFNYXA6IHsgaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IG51bGwgfSxcclxuXHRcdC8vIGFscGhhVGVzdDogeyBpczogXCJ1bmlmb3JtXCIsZGVmYXVsdDogMCB9LFxyXG5cdFx0Ly8gdXZUcmFuc2Zvcm06IHsgaXM6IFwidW5pZm9ybVwiLGRlZmF1bHQ6IC8qQF9fUFVSRV9fKi8gbmV3IE1hdHJpeDMoKSB9LFxyXG5cdH0sXHJcblx0dmVydGV4U2hhZGVyOiBwb2ludFNoYWRlclZlcnQsXHJcblx0ZnJhZ21lbnRTaGFkZXI6IHBvaW50U2hhZGVyRnJhZyxcclxuXHRpbml0OiBmdW5jdGlvbiAoZGF0YSkge1xyXG5cdFx0Y29uc29sZS5sb2coQUZSQU1FKTtcclxuXHRcdGNvbnNvbGUubG9nKFRIUkVFKTtcclxuXHRcdGNvbnNvbGUubG9nKFRIUkVFLlVuaWZvcm1zTGliLnBvaW50cyk7XHJcblx0XHRsZXQgZm9nX3VuaSA9IFRIUkVFLlVuaWZvcm1zTGliLmZvZztcclxuXHRcdGxldCBwb2ludHNfdW5pID0gVEhSRUUuVW5pZm9ybXNMaWIucG9pbnRzO1xyXG5cdFx0cG9pbnRzX3VuaS5kaWZmdXNlLnZhbHVlLmcgPSAwO1xyXG5cdFx0cG9pbnRzX3VuaS5kaWZmdXNlLnZhbHVlLmIgPSAwO1xyXG5cdFx0dGhpcy5hdHRyaWJ1dGVzID0gdGhpcy5pbml0VmFyaWFibGVzKGRhdGEsIFwiYXR0cmlidXRlXCIpO1xyXG5cdFx0dGhpcy51bmlmb3JtcyA9IFRIUkVFLlVuaWZvcm1zVXRpbHMubWVyZ2UoW1xyXG5cdFx0XHR0aGlzLmluaXRWYXJpYWJsZXMoZGF0YSwgXCJ1bmlmb3JtXCIpLFxyXG5cdFx0XHQvLyBUSFJFRS5Vbmlmb3Jtc0xpYltcImxpZ2h0c1wiXSxcclxuXHRcdFx0Zm9nX3VuaSxcclxuXHRcdFx0cG9pbnRzX3VuaSxcclxuXHRcdF0pO1xyXG5cdFx0dGhpcy5tYXRlcmlhbCA9IG5ldyAodGhpcy5yYXcgPyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCA6IFRIUkVFLlNoYWRlck1hdGVyaWFsKSh7XHJcblx0XHRcdC8vIGF0dHJpYnV0ZXM6IHRoaXMuYXR0cmlidXRlcyxcclxuXHRcdFx0dW5pZm9ybXM6IHRoaXMudW5pZm9ybXMsXHJcblx0XHRcdHZlcnRleFNoYWRlcjogdGhpcy52ZXJ0ZXhTaGFkZXIsXHJcblx0XHRcdGZyYWdtZW50U2hhZGVyOiB0aGlzLmZyYWdtZW50U2hhZGVyLFxyXG5cdFx0XHQvLyBsaWdodHM6IHRydWUsXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzLm1hdGVyaWFsO1xyXG5cdH0sXHJcblxyXG5cdGluaXRWYXJpYWJsZXM6IGZ1bmN0aW9uIChkYXRhLCB0eXBlKSB7XHJcblx0XHR2YXIga2V5O1xyXG5cdFx0dmFyIHNjaGVtYSA9IHRoaXMuc2NoZW1hO1xyXG5cdFx0dmFyIHZhcmlhYmxlcyA9IHt9O1xyXG5cdFx0dmFyIHZhclR5cGU7XHJcblxyXG5cdFx0Zm9yIChrZXkgaW4gc2NoZW1hKSB7XHJcblx0XHRcdGlmIChzY2hlbWFba2V5XS5pcyAhPT0gdHlwZSkge1xyXG5cdFx0XHRcdGNvbnRpbnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhclR5cGUgPSBwcm9wZXJ0eVRvVGhyZWVNYXBwaW5nW3NjaGVtYVtrZXldLnR5cGVdO1xyXG5cdFx0XHR2YXJpYWJsZXNba2V5XSA9IHtcclxuXHRcdFx0XHR0eXBlOiB2YXJUeXBlLFxyXG5cdFx0XHRcdHZhbHVlOiB1bmRlZmluZWQsIC8vIExldCB1cGRhdGVWYXJpYWJsZXMgaGFuZGxlIHNldHRpbmcgdGhlc2UuXHJcblx0XHRcdH07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdmFyaWFibGVzO1xyXG5cdH0sXHJcbn0pO1xyXG5cclxuQUZSQU1FLnJlZ2lzdGVyR2VvbWV0cnkoXCJwb2ludFwiLCB7XHJcblx0aW5pdDogZnVuY3Rpb24gKCkge1xyXG5cdFx0Ly8gY29uc3QgdmVydGljZXMgPSBbXTtcclxuXHJcblx0XHQvLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDAwOyBpKyspIHtcclxuXHRcdC8vIFx0Y29uc3QgeCA9IFRIUkVFLk1hdGhVdGlscy5yYW5kRmxvYXRTcHJlYWQoMjAwMCk7XHJcblx0XHQvLyBcdGNvbnN0IHkgPSBUSFJFRS5NYXRoVXRpbHMucmFuZEZsb2F0U3ByZWFkKDIwMDApO1xyXG5cdFx0Ly8gXHRjb25zdCB6ID0gVEhSRUUuTWF0aFV0aWxzLnJhbmRGbG9hdFNwcmVhZCgyMDAwKTtcclxuXHJcblx0XHQvLyBcdHZlcnRpY2VzLnB1c2goeCwgeSwgeik7XHJcblx0XHQvLyB9XHJcblx0XHQvLyBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xyXG5cdFx0Ly8gZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUodmVydGljZXMsIDMpKTtcclxuXHRcdC8vIHJldHVybiBnZW9tZXRyeTtcclxuXHR9LFxyXG59KTtcclxuXHJcbkFGUkFNRS5yZWdpc3RlclNoYWRlcihcInZveGVscmVzXCIsIHtcclxuXHRzY2hlbWE6IHtcclxuXHRcdHQ6IHsgdHlwZTogXCJ0aW1lXCIsIGlzOiBcInVuaWZvcm1cIiwgZGVmYXVsdDogMC4wIH0sXHJcblx0fSxcclxuXHRyYXc6IHRydWUsXHJcblx0dmVydGV4U2hhZGVyOiBWRVJURVhfU0hBREVSLFxyXG5cdGZyYWdtZW50U2hhZGVyOiBGUkFHTUVOVF9TSEFERVIsXHJcblx0aW5pdDogZnVuY3Rpb24gKGRhdGEpIHtcclxuXHRcdGNvbnNvbGUubG9nKEFGUkFNRSk7XHJcblx0XHR0aGlzLmF0dHJpYnV0ZXMgPSB0aGlzLmluaXRWYXJpYWJsZXMoZGF0YSwgXCJhdHRyaWJ1dGVcIik7XHJcblx0XHR0aGlzLnVuaWZvcm1zID0gVEhSRUUuVW5pZm9ybXNVdGlscy5tZXJnZShbXHJcblx0XHRcdHRoaXMuaW5pdFZhcmlhYmxlcyhkYXRhLCBcInVuaWZvcm1cIiksXHJcblx0XHRcdFRIUkVFLlVuaWZvcm1zTGliW1wibGlnaHRzXCJdLFxyXG5cdFx0XSk7XHJcblx0XHR0aGlzLm1hdGVyaWFsID0gbmV3ICh0aGlzLnJhdyA/IFRIUkVFLlJhd1NoYWRlck1hdGVyaWFsIDogVEhSRUUuU2hhZGVyTWF0ZXJpYWwpKHtcclxuXHRcdFx0Ly8gYXR0cmlidXRlczogdGhpcy5hdHRyaWJ1dGVzLFxyXG5cdFx0XHR1bmlmb3JtczogdGhpcy51bmlmb3JtcyxcclxuXHRcdFx0dmVydGV4U2hhZGVyOiB0aGlzLnZlcnRleFNoYWRlcixcclxuXHRcdFx0ZnJhZ21lbnRTaGFkZXI6IHRoaXMuZnJhZ21lbnRTaGFkZXIsXHJcblx0XHRcdGxpZ2h0czogdHJ1ZSxcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubWF0ZXJpYWw7XHJcblx0fSxcclxuXHJcblx0aW5pdFZhcmlhYmxlczogZnVuY3Rpb24gKGRhdGEsIHR5cGUpIHtcclxuXHRcdHZhciBrZXk7XHJcblx0XHR2YXIgc2NoZW1hID0gdGhpcy5zY2hlbWE7XHJcblx0XHR2YXIgdmFyaWFibGVzID0ge307XHJcblx0XHR2YXIgdmFyVHlwZTtcclxuXHJcblx0XHRmb3IgKGtleSBpbiBzY2hlbWEpIHtcclxuXHRcdFx0aWYgKHNjaGVtYVtrZXldLmlzICE9PSB0eXBlKSB7XHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyVHlwZSA9IHByb3BlcnR5VG9UaHJlZU1hcHBpbmdbc2NoZW1hW2tleV0udHlwZV07XHJcblx0XHRcdHZhcmlhYmxlc1trZXldID0ge1xyXG5cdFx0XHRcdHR5cGU6IHZhclR5cGUsXHJcblx0XHRcdFx0dmFsdWU6IHVuZGVmaW5lZCwgLy8gTGV0IHVwZGF0ZVZhcmlhYmxlcyBoYW5kbGUgc2V0dGluZyB0aGVzZS5cclxuXHRcdFx0fTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB2YXJpYWJsZXM7XHJcblx0fSxcclxufSk7XHJcbi8vIGNvbnNvbGUubG9nKEFGUkFNRSk7XHJcbi8vIGV4cG9ydCBjb25zdCBzbSA9IG5ldyBUSFJFRS5SYXdTaGFkZXJNYXRlcmlhbCh7XHJcbi8vIFx0bGlnaHRzOiB0cnVlLFxyXG4vLyBcdHZlcnRleFNoYWRlcjogVkVSVEVYX1NIQURFUixcclxuLy8gXHRmcmFnbWVudFNoYWRlcjogRlJBR01FTlRfU0hBREVSLFxyXG4vLyB9KTtcclxuXHJcbi8vIHVuaWZvcm1zLmFtYmllbnRMaWdodENvbG9yLnZhbHVlID0gbGlnaHRzLnN0YXRlLmFtYmllbnQ7XHJcbi8vIHVuaWZvcm1zLmxpZ2h0UHJvYmUudmFsdWUgPSBsaWdodHMuc3RhdGUucHJvYmU7XHJcbi8vIHVuaWZvcm1zLmRpcmVjdGlvbmFsTGlnaHRzLnZhbHVlID0gbGlnaHRzLnN0YXRlLmRpcmVjdGlvbmFsO1xyXG4vLyB1bmlmb3Jtcy5kaXJlY3Rpb25hbExpZ2h0U2hhZG93cy52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5kaXJlY3Rpb25hbFNoYWRvdztcclxuLy8gdW5pZm9ybXMuc3BvdExpZ2h0cy52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5zcG90O1xyXG4vLyB1bmlmb3Jtcy5zcG90TGlnaHRTaGFkb3dzLnZhbHVlID0gbGlnaHRzLnN0YXRlLnNwb3RTaGFkb3c7XHJcbi8vIHVuaWZvcm1zLnJlY3RBcmVhTGlnaHRzLnZhbHVlID0gbGlnaHRzLnN0YXRlLnJlY3RBcmVhO1xyXG4vLyB1bmlmb3Jtcy5sdGNfMS52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5yZWN0QXJlYUxUQzE7XHJcbi8vIHVuaWZvcm1zLmx0Y18yLnZhbHVlID0gbGlnaHRzLnN0YXRlLnJlY3RBcmVhTFRDMjtcclxuLy8gdW5pZm9ybXMucG9pbnRMaWdodHMudmFsdWUgPSBsaWdodHMuc3RhdGUucG9pbnQ7XHJcbi8vIHVuaWZvcm1zLnBvaW50TGlnaHRTaGFkb3dzLnZhbHVlID0gbGlnaHRzLnN0YXRlLnBvaW50U2hhZG93O1xyXG4vLyB1bmlmb3Jtcy5oZW1pc3BoZXJlTGlnaHRzLnZhbHVlID0gbGlnaHRzLnN0YXRlLmhlbWk7XHJcbi8vIHVuaWZvcm1zLmRpcmVjdGlvbmFsU2hhZG93TWFwLnZhbHVlID0gbGlnaHRzLnN0YXRlLmRpcmVjdGlvbmFsU2hhZG93TWFwO1xyXG4vLyB1bmlmb3Jtcy5kaXJlY3Rpb25hbFNoYWRvd01hdHJpeC52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5kaXJlY3Rpb25hbFNoYWRvd01hdHJpeDtcclxuLy8gdW5pZm9ybXMuc3BvdFNoYWRvd01hcC52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5zcG90U2hhZG93TWFwO1xyXG4vLyB1bmlmb3Jtcy5zcG90U2hhZG93TWF0cml4LnZhbHVlID0gbGlnaHRzLnN0YXRlLnNwb3RTaGFkb3dNYXRyaXg7XHJcbi8vIHVuaWZvcm1zLnBvaW50U2hhZG93TWFwLnZhbHVlID0gbGlnaHRzLnN0YXRlLnBvaW50U2hhZG93TWFwO1xyXG4vLyB1bmlmb3Jtcy5wb2ludFNoYWRvd01hdHJpeC52YWx1ZSA9IGxpZ2h0cy5zdGF0ZS5wb2ludFNoYWRvd01hdHJpeDsgLy8gVE9ETyAoYWJlbG5hdGlvbik6IGFkZCBhcmVhIGxpZ2h0cyBzaGFkb3cgaW5mbyB0byB1bmlmb3Jtc1xyXG4iLCJ2YXIgbWFwID0ge1xuXHRcIi4vU3ByaXRlQXRsYXMuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL1Nwcml0ZUF0bGFzLmpzXCIsXG5cdFwiLi9oZWxwZXJzLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9oZWxwZXJzLmpzXCIsXG5cdFwiLi9tZXNoZ2VuLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9tZXNoZ2VuLmpzXCIsXG5cdFwiLi92b3hlbHJlcy5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvdm94ZWxyZXMuanNcIixcblx0XCJjb21wb25lbnRzL1Nwcml0ZUF0bGFzLmpzXCI6IFwiLi9zcmMvY29tcG9uZW50cy9TcHJpdGVBdGxhcy5qc1wiLFxuXHRcImNvbXBvbmVudHMvaGVscGVycy5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvaGVscGVycy5qc1wiLFxuXHRcImNvbXBvbmVudHMvbWVzaGdlbi5qc1wiOiBcIi4vc3JjL2NvbXBvbmVudHMvbWVzaGdlbi5qc1wiLFxuXHRcImNvbXBvbmVudHMvdm94ZWxyZXMuanNcIjogXCIuL3NyYy9jb21wb25lbnRzL3ZveGVscmVzLmpzXCJcbn07XG5cblxuZnVuY3Rpb24gd2VicGFja0NvbnRleHQocmVxKSB7XG5cdHZhciBpZCA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpO1xuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhpZCk7XG59XG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKSB7XG5cdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8obWFwLCByZXEpKSB7XG5cdFx0dmFyIGUgPSBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiICsgcmVxICsgXCInXCIpO1xuXHRcdGUuY29kZSA9ICdNT0RVTEVfTk9UX0ZPVU5EJztcblx0XHR0aHJvdyBlO1xuXHR9XG5cdHJldHVybiBtYXBbcmVxXTtcbn1cbndlYnBhY2tDb250ZXh0LmtleXMgPSBmdW5jdGlvbiB3ZWJwYWNrQ29udGV4dEtleXMoKSB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhtYXApO1xufTtcbndlYnBhY2tDb250ZXh0LnJlc29sdmUgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmU7XG5tb2R1bGUuZXhwb3J0cyA9IHdlYnBhY2tDb250ZXh0O1xud2VicGFja0NvbnRleHQuaWQgPSBcIi4vc3JjL2NvbXBvbmVudHMgc3luYyBcXFxcLmpzJFwiOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiZnVuY3Rpb24gaW1wb3J0QWxsKHIpIHtcclxuICByLmtleXMoKS5mb3JFYWNoKHIpO1xyXG59XHJcblxyXG5pbXBvcnRBbGwocmVxdWlyZS5jb250ZXh0KCcuL2NvbXBvbmVudHMnLCBmYWxzZSwgL1xcLmpzJC8pKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9