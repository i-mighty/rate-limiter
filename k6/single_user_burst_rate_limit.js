import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 12,
      timeUnit: "1s", // 1000 iterations per second, i.e. 1000 RPS
      duration: "10s",
      preAllocatedVUs: 1, // how large the initial pool of VUs would be
      maxVUs: 1, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const response = http.post(
    "http://server:3003/send-notification",
    {},
    { headers: { "client-key": "641cfcfdbd76775d0bab39bc" } }
  );
  check(response, { "status is 200": (r) => r.status === 200 });
  check(response, { "Rate limited": (r) => r.status === 429 });
}
