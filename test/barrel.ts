import * as etats from "./eta";
import * as alphabetats from "./alpha/beta";
import * as gammazetats from "./gamma/zeta";
import * as gammadeltaepsilonts from "./gamma/delta/epsilon";
export const alpha = {
  "beta": alphabetats,
};
export {etats as eta};
export const gamma = {
  "delta": {
    "epsilon": gammadeltaepsilonts,
  },
  "zeta": gammazetats,
};
