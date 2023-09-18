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
