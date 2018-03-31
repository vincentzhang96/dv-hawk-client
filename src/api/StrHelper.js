export default {
    // http://www.ietf.org/rfc/rfc2781.txt
    decodeUtf16(w) {
        let i = 0;
        let len = w.byteLength;
        console.log(len);
        let w1, w2;
        let charCodes = [];
        while (i < len) {
            w1 = w[i++];
            if ((w1 & 0xF800) !== 0xD800) { // w1 < 0xD800 || w1 > 0xDFFF
                charCodes.push(w1);
                continue;
            }
            if ((w1 & 0xFC00) === 0xD800) { // w1 >= 0xD800 && w1 <= 0xDBFF
                throw new RangeError('Invalid octet 0x' + w1.toString(16) + ' at offset ' + (i - 1));
            }
            if (i === len) {
                throw new RangeError('Expected additional octet');
            }
            w2 = w[i++];
            if ((w2 & 0xFC00) !== 0xDC00) { // w2 < 0xDC00 || w2 > 0xDFFF)
                throw new RangeError('Invalid octet 0x' + w2.toString(16) + ' at offset ' + (i - 1));
            }
            charCodes.push(((w1 & 0x3ff) << 10) + (w2 & 0x3ff) + 0x10000);
        }
        return String.fromCharCode.apply(String, charCodes);
    },
    decodeWideStr(buffer) {
        let len = buffer.byteLength;
        if (len % 2 != 0) {
            throw new RangeError("Expected an even number of bytes, got " + len);
        }

        let view = new Uint16Array(buffer);

        let ret = "";

        for (let i = 0; i < len/2; i += 1) {
            let lo = view[i];
            if (lo != 0) {
                ret += String.fromCharCode(lo);
            }
        }

        return ret;
    }
};
