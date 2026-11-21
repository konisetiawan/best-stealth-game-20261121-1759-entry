export const LEVELS = [
  {
    name: 'The Drowned Garden', short: 'GARDEN', subtitle: 'A hedge maze under a moonless sky', palette: 'garden',
    start: { x: 105, y: 438 }, exit: { x: 921, y: 92, w: 48, h: 70 }, relic: { x: 810, y: 276 },
    pebbles: 4, lamps: [{ x: 500, y: 281, r: 116, hue: 45 }],
    cover: [
      { x: 205, y: 52, w: 155, h: 74, type: 'hedge' }, { x: 403, y: 73, w: 74, h: 178, type: 'hedge' },
      { x: 536, y: 36, w: 185, h: 64, type: 'hedge' }, { x: 150, y: 202, w: 78, h: 156, type: 'hedge' },
      { x: 278, y: 277, w: 188, h: 64, type: 'hedge' }, { x: 522, y: 217, w: 70, h: 158, type: 'hedge' },
      { x: 692, y: 137, w: 66, h: 126, type: 'hedge' }, { x: 697, y: 390, w: 156, h: 63, type: 'hedge' },
      { x: 325, y: 411, w: 146, h: 62, type: 'hedge' }, { x: 72, y: 72, w: 44, h: 39, type: 'fern' },
      { x: 608, y: 438, w: 55, h: 44, type: 'fern' }, { x: 858, y: 335, w: 42, h: 53, type: 'fern' }
    ],
    walls: [{ x: 0, y: 0, w: 1000, h: 18 }, { x: 0, y: 542, w: 1000, h: 18 }, { x: 0, y: 0, w: 18, h: 560 }, { x: 982, y: 0, w: 18, h: 560 }],
    loot: [{ x: 348, y: 177, kind: 'coin', value: 1 }, { x: 609, y: 150, kind: 'gem', value: 3 }, { x: 863, y: 481, kind: 'coin', value: 1 }],
    guards: [
      { x: 296, y: 175, route: [{ x: 292, y: 176 }, { x: 377, y: 185 }, { x: 375, y: 367 }, { x: 263, y: 370 }], angle: 0.12 },
      { x: 817, y: 324, route: [{ x: 819, y: 320 }, { x: 615, y: 398 }, { x: 603, y: 181 }, { x: 818, y: 124 }], angle: -2.1 }
    ]
  },
  {
    name: 'The Velvet Gallery', short: 'GALLERY', subtitle: 'Portraits keep their own counsel', palette: 'gallery',
    start: { x: 92, y: 486 }, exit: { x: 925, y: 72, w: 48, h: 70 }, relic: { x: 846, y: 285 },
    pebbles: 3, lamps: [{ x: 259, y: 196, r: 121, hue: 43 }, { x: 563, y: 361, r: 116, hue: 41 }, { x: 825, y: 176, r: 115, hue: 42 }],
    cover: [
      { x: 187, y: 55, w: 25, h: 120, type: 'painting' }, { x: 356, y: 61, w: 105, h: 44, type: 'statue' },
      { x: 304, y: 234, w: 124, h: 54, type: 'statue' }, { x: 474, y: 127, w: 36, h: 185, type: 'painting' },
      { x: 660, y: 70, w: 25, h: 135, type: 'painting' }, { x: 679, y: 301, w: 95, h: 43, type: 'statue' },
      { x: 196, y: 370, w: 110, h: 48, type: 'statue' }, { x: 453, y: 410, w: 34, h: 108, type: 'painting' },
      { x: 807, y: 413, w: 28, h: 103, type: 'painting' }, { x: 554, y: 60, w: 50, h: 44, type: 'statue' }
    ],
    walls: [{ x: 0, y: 0, w: 1000, h: 18 }, { x: 0, y: 542, w: 1000, h: 18 }, { x: 0, y: 0, w: 18, h: 560 }, { x: 982, y: 0, w: 18, h: 560 }, { x: 463, y: 18, w: 13, h: 76 }, { x: 705, y: 435, w: 13, h: 107 }],
    loot: [{ x: 125, y: 226, kind: 'gem', value: 3 }, { x: 401, y: 350, kind: 'coin', value: 1 }, { x: 741, y: 231, kind: 'gem', value: 3 }, { x: 891, y: 470, kind: 'coin', value: 1 }],
    guards: [
      { x: 272, y: 309, route: [{ x: 270, y: 303 }, { x: 383, y: 318 }, { x: 388, y: 157 }, { x: 241, y: 147 }], angle: -0.8 },
      { x: 580, y: 226, route: [{ x: 579, y: 229 }, { x: 641, y: 381 }, { x: 533, y: 453 }, { x: 518, y: 178 }], angle: 1.1 },
      { x: 824, y: 352, route: [{ x: 823, y: 351 }, { x: 899, y: 312 }, { x: 885, y: 186 }, { x: 770, y: 241 }], angle: -2.5 }
    ]
  },
  {
    name: 'The Black Vault', short: 'VAULT', subtitle: 'One last shadow between you and the dawn', palette: 'vault',
    start: { x: 78, y: 483 }, exit: { x: 925, y: 76, w: 48, h: 70 }, relic: { x: 500, y: 275 },
    pebbles: 3, lamps: [{ x: 500, y: 281, r: 143, hue: 47 }, { x: 244, y: 154, r: 96, hue: 40 }, { x: 767, y: 410, r: 99, hue: 40 }],
    cover: [
      { x: 148, y: 88, w: 96, h: 49, type: 'vault' }, { x: 333, y: 62, w: 48, h: 163, type: 'vault' },
      { x: 620, y: 63, w: 48, h: 163, type: 'vault' }, { x: 769, y: 96, w: 88, h: 45, type: 'vault' },
      { x: 144, y: 409, w: 105, h: 47, type: 'vault' }, { x: 338, y: 337, w: 44, h: 158, type: 'vault' },
      { x: 618, y: 337, w: 44, h: 158, type: 'vault' }, { x: 760, y: 422, w: 111, h: 45, type: 'vault' },
      { x: 448, y: 186, w: 104, h: 24, type: 'case' }, { x: 448, y: 352, w: 104, h: 24, type: 'case' },
      { x: 254, y: 265, w: 58, h: 46, type: 'vault' }, { x: 688, y: 264, w: 58, h: 46, type: 'vault' }
    ],
    walls: [{ x: 0, y: 0, w: 1000, h: 18 }, { x: 0, y: 542, w: 1000, h: 18 }, { x: 0, y: 0, w: 18, h: 560 }, { x: 982, y: 0, w: 18, h: 560 }, { x: 450, y: 18, w: 9, h: 96 }, { x: 541, y: 18, w: 9, h: 96 }],
    loot: [{ x: 135, y: 287, kind: 'gem', value: 3 }, { x: 864, y: 277, kind: 'gem', value: 3 }, { x: 280, y: 484, kind: 'coin', value: 1 }],
    guards: [
      { x: 265, y: 201, route: [{ x: 262, y: 205 }, { x: 300, y: 332 }, { x: 228, y: 366 }, { x: 194, y: 189 }], angle: 0.9 },
      { x: 407, y: 276, route: [{ x: 409, y: 278 }, { x: 448, y: 139 }, { x: 403, y: 95 }, { x: 387, y: 440 }], angle: -1.5 },
      { x: 593, y: 281, route: [{ x: 593, y: 279 }, { x: 576, y: 435 }, { x: 606, y: 111 }, { x: 563, y: 153 }], angle: 1.6 },
      { x: 746, y: 195, route: [{ x: 744, y: 191 }, { x: 800, y: 361 }, { x: 725, y: 385 }, { x: 699, y: 166 }], angle: 2.2 }
    ], camera: { x: 500, y: 40, range: 260, angle: 1.55, sweep: 0.72 }
  }
];
