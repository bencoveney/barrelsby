import * as alphabetats from "test/alpha/beta";
import * as etats from "test/eta";
import * as gammadeltalambdats from "test/gamma/delta/lambda";
import * as gammadeltathetaiotats from "test/gamma/delta/theta/iota";
import * as gammadeltathetakappats from "test/gamma/delta/theta/kappa";
export { etats as eta };
export const alpha = {
  beta: alphabetats,
};
export const gamma = {
  delta: {
    lambda: gammadeltalambdats,
    theta: {
      iota: gammadeltathetaiotats,
      kappa: gammadeltathetakappats,
    },
  },
};
