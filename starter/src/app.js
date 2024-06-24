import { Loader } from "@googlemaps/js-api-loader";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// class ThreeDObject {
//   constructor(mapElementId, apiKey, mapOptions, modelSource, lat, lng) {
//     this.mapElementId = mapElementId;
//     this.apiKey = apiKey;
//     this.mapOptions = mapOptions;
//     this.modelSource = modelSource;
//     this.lat = lat;
//     this.lng = lng;

//     this.scene = null;
//     this.renderer = null;
//     this.camera = null;
//     this.loader = null;
//     this.webGLOverlayView = null;
//     this.map = null;

//     this.initialized = false; // Nouveau: pour suivre l'état d'initialisation
//   }

//   async init() {
//     console.log("Initialisation de la carte");
//     await this.initMap();
//     console.log("Carte initialisée");
//     this.initWebGLOverlayView();
//     console.log("WebGLOverlayView initialisée");
//     await this.waitForInitialization(); // Nouveau: attendre l'initialisation complète
//     console.log("Initialisation complète");
//     this.initialized = true; // Marquer comme initialisé
//   }

//   async initMap() {
//     const apiLoader = new Loader({ apiKey: this.apiKey });
//     await apiLoader.load();
//     console.log("API Google Maps chargée");
//     this.map = new google.maps.Map(
//       document.getElementById(this.mapElementId),
//       this.mapOptions
//     );
//   }

//   initWebGLOverlayView() {
//     this.webGLOverlayView = new google.maps.WebGLOverlayView();

//     this.webGLOverlayView.onAdd = () => {
//       console.log("WebGLOverlayView ajouté");
//       this.setupScene();
//       this.loadModel();
//     };

//     this.webGLOverlayView.onContextRestored = ({ gl }) => {
//       console.log("Contexte WebGL restauré");
//       this.setupRenderer(gl);
//     };

//     this.webGLOverlayView.onDraw = ({ gl, transformer }) => {
//       this.updateCamera(transformer);
//       this.renderScene();
//     };

//     this.webGLOverlayView.setMap(this.map);
//   }

//   setupScene() {
//     this.scene = new THREE.Scene();
//     this.camera = new THREE.PerspectiveCamera();
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
//     this.scene.add(ambientLight);
//     const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
//     directionalLight.position.set(0.5, -1, 0.5);
//     this.scene.add(directionalLight);
//     console.log("Scène configurée");
//   }

//   loadModel() {
//     this.loader = new GLTFLoader();
//     this.loader.load(
//       this.modelSource,
//       (gltf) => {
//         console.log("Modèle GLTF chargé");
//         gltf.scene.scale.set(100, 100, 100);
//         gltf.scene.rotation.x = (180 * Math.PI) / 180;
//         this.scene.add(gltf.scene);
//         this.webGLOverlayView.requestRedraw(); // Nouveau: demander un redessin après chargement
//         this.initialized = true; // Marquer comme initialisé une fois le modèle chargé
//       },
//       undefined,
//       (error) => {
//         console.error("Erreur de chargement du modèle GLTF:", error);
//       }
//     );
//   }

//   setupRenderer(gl) {
//     this.renderer = new THREE.WebGLRenderer({
//       canvas: gl.canvas,
//       context: gl,
//       ...gl.getContextAttributes(),
//     });
//     this.renderer.autoClear = false;
//     console.log("Renderer configuré");
//   }

//   updateCamera(transformer, lat = this.lat, lng = this.lng) {
//     const latLngAltitudeLiteral = {
//       lat: lat,
//       lng: lng,
//       altitude: 50,
//     };
//     const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
//     this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
//   }

//   renderScene() {
//     this.renderer.render(this.scene, this.camera);
//     this.renderer.resetState();
//   }

//   // Nouveau: fonction pour attendre l'initialisation complète
//   waitForInitialization() {
//     return new Promise((resolve) => {
//       const checkInitialized = () => {
//         if (this.initialized) {
//           resolve();
//         } else {
//           setTimeout(checkInitialized, 100); // Vérifier toutes les 100ms
//         }
//       };
//       checkInitialized();
//     });
//   }
// }

class ThreeDObject {
  constructor(map, modelSource, lat, lng) {
    this.map = map;
    this.modelSource = modelSource;
    this.lat = lat;
    this.lng = lng;

    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.loader = null;
    this.webGLOverlayView = null;

    this.initialized = false; // Pour suivre l'état d'initialisation
  }

  async init() {
    this.initWebGLOverlayView();
    console.log("WebGLOverlayView initialisée");
    await this.waitForInitialization(); // Attendre l'initialisation complète
    console.log("Initialisation complète");
    this.initialized = true; // Marquer comme initialisé
  }

  initWebGLOverlayView() {
    this.webGLOverlayView = new google.maps.WebGLOverlayView();

    this.webGLOverlayView.onAdd = () => {
      console.log("WebGLOverlayView ajouté");
      this.setupScene();
      this.loadModel();
    };

    this.webGLOverlayView.onContextRestored = ({ gl }) => {
      console.log("Contexte WebGL restauré");
      this.setupRenderer(gl);
    };

    this.webGLOverlayView.onDraw = ({ gl, transformer }) => {
      this.updateCamera(transformer);
      this.renderScene();
    };

    this.webGLOverlayView.setMap(this.map);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    this.scene.add(directionalLight);
    console.log("Scène configurée");
  }

  loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load(
      this.modelSource,
      (gltf) => {
        console.log("Modèle GLTF chargé");
        gltf.scene.scale.set(100, 100, 100);
        gltf.scene.rotation.x = (180 * Math.PI) / 180;
        this.scene.add(gltf.scene);
        this.webGLOverlayView.requestRedraw(); // Demander un redessin après chargement
        this.initialized = true; // Marquer comme initialisé une fois le modèle chargé
      },
      undefined,
      (error) => {
        console.error("Erreur de chargement du modèle GLTF:", error);
      }
    );
  }

  setupRenderer(gl) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    this.renderer.autoClear = false;
    console.log("Renderer configuré");
  }

  updateCamera(transformer, lat = this.lat, lng = this.lng) {
    const latLngAltitudeLiteral = {
      lat: lat,
      lng: lng,
      altitude: 50,
    };
    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    this.camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera);
    this.renderer.resetState();
  }

  waitForInitialization() {
    return new Promise((resolve) => {
      const checkInitialized = () => {
        if (this.initialized) {
          resolve();
        } else {
          setTimeout(checkInitialized, 100); // Vérifier toutes les 100ms
        }
      };
      checkInitialized();
    });
  }
}

// Fonction pour initialiser la carte Google Maps
async function initMap(apiKey, mapElementId, mapOptions) {
  const apiLoader = new Loader({ apiKey: apiKey });
  await apiLoader.load();
  console.log("API Google Maps chargée");
  return new google.maps.Map(document.getElementById(mapElementId), mapOptions);
}

// Fonction pour créer les objets 3D
async function create3DObjects(map, data, modelSource) {
  console.log("Début de la création des objets 3D");
  const promises = data.map(async (vehicleData) => {
    console.log(
      "Création de l'objet 3D pour le véhicule",
      vehicleData.vehicle.vehicle.id
    );
    const obj3D = new ThreeDObject(
      map,
      modelSource,
      vehicleData.vehicle.position.latitude,
      vehicleData.vehicle.position.longitude
    );
    try {
      await obj3D.init();
      console.log(
        "Objet 3D créé pour le véhicule",
        vehicleData.vehicle.vehicle.id
      );
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de l'objet 3D pour le véhicule",
        vehicleData.vehicle.vehicle.id,
        error
      );
    }
  });

  try {
    await Promise.all(promises);
    console.log("Tous les objets 3D ont été créés");
  } catch (error) {
    console.error(
      "Une erreur est survenue lors de la création des objets 3D",
      error
    );
  }
}
// Utilisation de la classe
const mapElementId = "map";
const apiKey = "AIzaSyCXO_m2i3nxrLhht83Fo5fsPN6euoLzPIY";
const mapOptions = {
  zoom: 18,
  center: { lat: 44.84518710934242, lng: -0.5727742405924661 },
  mapId: "bd30d5c0fb57fe73",
  disableDefaultUI: true,
  tilt: 45,
  heading: 90,
};
const modelSource = "pin.gltf"; // Chemin vers votre modèle GLTF

const data = [
  {
    id: "RTVP:T:39945117-2024_HIVER-TR_A000-Lun-Mer-54",
    vehicle: {
      trip: {
        tripId: "39945117-2024_HIVER-TR_A000-Lun-Mer-54",
        routeId: "60",
        directionId: 0,
      },
      position: {
        latitude: 44.84531825017579,
        longitude: -0.6729807453785114,
        bearing: 101,
        odometer: 4364,
        speed: 7.5,
      },
      currentStopSequence: 8,
      currentStatus: "IN_TRANSIT_TO",
      timestamp: "1719263922",
      stopId: "3727",
      vehicle: {
        id: "ineo-tram:1301",
        label: "Claveau",
      },
    },
  },
  {
    id: "RTVP:T:39942960-2024_HIVER-TR_A000-Lun-Mer-54",
    vehicle: {
      trip: {
        tripId: "39942960-2024_HIVER-TR_A000-Lun-Mer-54",
        routeId: "61",
        directionId: 1,
      },
      position: {
        latitude: 44.84531825017579,
        longitude: -0.5729807452785114,
        bearing: 186,
        odometer: 11518,
        speed: 6.666666507720947,
      },
      currentStopSequence: 24,
      currentStatus: "STOPPED_AT",
      timestamp: "1719263927",
      stopId: "7393",
      vehicle: {
        id: "ineo-tram:1302",
        label: "Les Pyrénées",
      },
    },
  },
];

// Initialisation et création des objets 3D
async function main() {
  const map = await initMap(apiKey, mapElementId, mapOptions);

  // Fetching API data inside the async function and awaiting the result
  const apiData = await fetch("http://localhost:3000/")
    .then((response) => response.json())
    .then((data) => {
      return data;
    });

  // Now apiData is properly awaited before being passed to create3DObjects
  await create3DObjects(map, apiData, modelSource);
}

// Call main and handle any potential errors
main().catch(console.error);
