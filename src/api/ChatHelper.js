import StrHelper from "./StrHelper";

export default {
    parseServerToClient(dv) {
        let ret = {};
        let scope = dv.getUint8(0);
        switch (scope) {
            case 1: {
                ret.scope = "chat";
                let subtype = dv.getUint8(1);
                switch (subtype) {
                    case 1:
                        ret.subtype = "local";
                        break;
                    case 2: 
                        ret.subtype = "party";
                        break;
                    case 3:
                        ret.subtype = "whisper";
                        break;
                    case 5:
                        ret.subtype = "field";
                        break;
                    case 6:
                        ret.subtype = "system";
                        break;
                    case 7:
                        ret.subtype = "world";
                        break;
                    default: 
                        ret.subtype = "unknown " + subtype;
                        break;
                }

                let nameSubArray = dv.buffer.slice(5, 5 + 38);
                let name = StrHelper.decodeWideStr(nameSubArray);
                if (name.length == 0) {
                    name = "[SYSTEM]";
                }
                ret.name = name;

                let msgLen = dv.getUint8(43);
                // ret.msgLen = msgLen;
                let messageSubArray = dv.buffer.slice(45, 45 + (msgLen * 2));
                ret.message = StrHelper.decodeWideStr(messageSubArray);

                break;
            }
            case 2: {
                ret.scope = "other";
                let subjectSubArray = dv.buffer.slice(1, 1 + 122);
                ret.subject = StrHelper.decodeWideStr(subjectSubArray);

                let subtype = dv.getUint8(123);
                let paramSubBuffer = dv.buffer.slice(124);
                let paramView = new DataView(paramSubBuffer);
                switch (subtype) {
                    case 1: {
                        ret.action = "successful enhance";
                        ret.enhancedItemId = paramView.getUint32(0, true);
                        ret.enhanceLevel = paramView.getUint8(4);
                        break;
                    }
                    case 2: {
                        ret.action = "achievement get";
                        ret.missionRowId = paramView.getUint32(0, true) + 1;   //  THIS +1 IS IMPORTANT
                        break;
                    }
                    case 3: {
                        ret.action = "discover rare charm item";
                        ret.charmRowId = paramView.getUint32(0, true);
                        break;
                    }
                    case 10: {
                        ret.action = "synth rare item";
                        ret.itemId = paramView.getUint32(0, true);
                        break;
                    }
                    default: {
                        ret.action = "unknown action " + subtype;
                        ret.param1 = paramView.getUint32(0, true);
                        ret.param2 =  paramView.getUint32(4, true);
                        break;
                    }
                }

                break;
            }
            case 4: {
                ret.scope = "guild";
                //  TODO
                break;
            }
            default: { ret.scope = "unknown " + scope; break; }
        }

        return ret;
    }
};
