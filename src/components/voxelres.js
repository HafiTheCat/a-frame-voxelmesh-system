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
