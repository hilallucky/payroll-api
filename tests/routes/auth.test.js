const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn().mockReturnValue({
        /* mocked decoded token data */
    }),
    decode: jest.fn().mockReturnValue({
        /* mocked decoded token data */
    }),
}));

// Example usage in your test:
it("should verify token", () => {
    const token = "mocked-token";
    const decoded = jwt.verify(token, "secret");
    expect(decoded).toEqual({
        /* your mocked decoded data */
    });
});

it("should decode token", () => {
    const token = "mocked-token";
    const decoded = jwt.decode(token);
    expect(decoded).toEqual({
        /* your mocked decoded data */
    });
});
