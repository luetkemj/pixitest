// https://www.redblobgames.com/maps/terrain-from-noise/

import SimplexNoise from "../../_snowpack/pkg/simplex-noise.js";

const noises = {
  // gen1: new SimplexNoise("seed1"),
  // gen2: new SimplexNoise("seed2"),
  // gen3: new SimplexNoise("seed3"),
  // gen4: new SimplexNoise("seed4"),
  // gen5: new SimplexNoise("seed5"),
  // gen6: new SimplexNoise("seed6"),
  gen1: new SimplexNoise(),
  gen2: new SimplexNoise(),
  gen3: new SimplexNoise(),
  gen4: new SimplexNoise(),
  gen5: new SimplexNoise(),
  gen6: new SimplexNoise(),
};

function noise(nx, ny, gen = "gen1") {
  // Rescale from -1.0:+1.0 to 0.0:1.0
  return noises[gen].noise2D(nx, ny) / 2 + 0.5;
}

export const makeNoise = ({
  generations = ["gen1", "gen2", "gen3"],
  width = 100,
  height = 100,
  poles = 2,
  equator = -2,
  // frequency
  f1 = 4,
  f2 = 6,
  f3 = 12,
  // octaves
  o1 = 1,
  // o2 = 0.5,
  // o3 = 0.25,
  o2 = 0.29,
  o3 = 0.51,
  // octaveOffsets
  oo1 = 5.3,
  oo2 = 9.1,
  oo3 = 17.8,
  oo4 = 23.5,
  // valleys
  // fudgeFactor = 1,
  // valleyPower = 1.7,
  valleyPower = 1.13,
  fudgeFactor = 1.06,
  // island
  island = false,
  islandAlgo = "diagonal", // dialgonal || euclidean || manhattan
}) => {
  const elevation = [];
  for (let y = 0; y < height; y++) {
    elevation[y] = [];
    for (let x = 0; x < width; x++) {
      let nx = x / width - 0.5,
        ny = y / height - 0.5;

      // const e =
      //   1 * noise(1 * nx, 1 * ny) +
      //   0.5 * noise(2 * nx + 5.3, 2 * ny, 2 + 9.1) +
      //   0.25 * noise(4 * nx + 17.8, 4 * ny + 23.5);
      // // elevation[y][x] = e / (1 + 0.5 + 0.25);
      // elevation[y][x] = Math.pow(e * 1.2, 4.3);

      let e =
        o1 * noise(f1 * nx, f1 * ny, generations[0]) +
        o2 * noise(f2 * nx + oo1, f2 * ny + oo2, generations[1]) +
        o3 * noise(f3 * nx + oo3, f3 * ny + oo4, generations[2]);
      e = e / (o1 + o2 + o3);

      e = Math.pow(e * fudgeFactor, valleyPower);

      if (island) {
        let d;
        if (islandAlgo === "diagonal") {
          d = 2.4 * Math.max(Math.abs(nx), Math.abs(ny));
        }

        if (islandAlgo === "euclidean") {
          d = Math.sqrt(nx * nx + ny * ny) / Math.sqrt(0.5);
        }

        if (islandAlgo === "manhattan") {
          d = d = Math.abs(nx) + Math.abs(ny);
        }

        e = (1 + e - d) / 2;
      }

      e =
        10 * e * e +
        poles +
        (equator - poles) * Math.sin(Math.PI * (y / height));

      elevation[y][x] = e;
    }
  }

  return elevation;
};
