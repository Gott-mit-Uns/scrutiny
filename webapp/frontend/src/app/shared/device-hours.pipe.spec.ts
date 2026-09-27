import { DeviceHoursPipe } from "./device-hours.pipe";

describe("DeviceHoursPipe", () => {
  it("create an instance", () => {
    const pipe = new DeviceHoursPipe();
    expect(pipe).toBeTruthy();
  });

  describe("#transform", () => {
    const testCases = [
      {
        input: 12345,
        configuration: "device_hours",
        result: "12345 小时",
      },
      {
        input: 15273,
        configuration: "humanize",
        result: "1 年, 8 个月, 3 周, 6 天, 15 小时",
      },
      {
        input: 48,
        configuration: null,
        result: "2 天",
      },
      {
        input: 168,
        configuration: "scrutiny",
        result: "1 周",
      },
      {
        input: null,
        configuration: "device_hours",
        result: "未知",
      },
      {
        input: null,
        configuration: "humanize",
        result: "未知",
      },
    ];

    testCases.forEach((test, index) => {
      it(`format input '${test.input}' with configuration '${test.configuration}', should be '${test.result}' (testcase: ${index + 1})`, () => {
        // test
        const pipe = new DeviceHoursPipe();
        const formatted = pipe.transform(test.input, test.configuration);
        expect(formatted).toEqual(test.result);
      });
    });
  });
});
