<template>
<div class="packet-parse">
    <table class="param-table">
        <thead>
            <th>Field</th>
            <th>Value</th>
        </thead>
        <tr v-for="(v, k) in packetData" :key="k" v-if="v != null">
            <th>{{k}}</th>
            <td>{{v}}</td>
        </tr>
    </table>
</div>
</template>

<script>
import StrHelper from "@/api/StrHelper";
import ChatHelper from "@/api/ChatHelper";

export default {
    name: 'packet-parse',
    props: ["packet"],
    computed: {
        packetData() {
            let dv = this.packet.datav;

            let type = dv.getUint8(0);
            
            let ret = this.parse(this.packet, new DataView(this.packet.data.slice(1)), type);
            
            let common = {
                type: type,
                typeName: this.typeToName(type),
            };

            return Object.assign(common, ret);
        }
    },
    methods: {
        typeToName(type) {
            switch (type) {
                case 4:     return "MOVE";
                case 11:    return "CHAT";
                case 32:    return "MAP TELEPORT";
                default:    return null;
            }
        },
        parse(packet, dv, type) {
            let ret = {};
            switch (type) {
                case 32: {
                    ret.unknown = dv.getUint8(0);
                    ret.warpTableRowId = dv.getUint32(1, true);
                }
                break;
                case 11: {
                    if (packet.direction == 1) {
                        ret = Object.assign(ret, ChatHelper.parseServerToClient(dv));
                    }
                }
            }

            return ret;
        },
    }
}
</script>

<style lang="less" scoped>

@dv-c-background: #131315;
@dv-c-body: #A6AEB3;
@dv-c-disabled: #35383A;
@dv-c-idle: #3D4B54;
@dv-c-accent-1: #3B6E96;
@dv-c-accent-2: #5AA9E5;
@dv-c-foreground: #98BCD4;
@dv-c-accent-3: #4488AA;
@dv-c-red: #cd2020;
@dv-c-green: #20cd40;

.param-table {
    border-collapse: collapse;
    text-align: center;
    thead {
        th {
            border-bottom: 2px solid @dv-c-body;
            color: black;
            font-size: 12px;
            font-weight: normal;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            text-align: center;
            height: 1em;
            padding: 0;

            &.first {
                border-right: 2px solid @dv-c-body;
                width: 50px;
                text-align: right;
            }

            &.fixed {
                width: 80px;
            }
        }

        tr:hover {
            background: none;
        }
    }

    tr {
        padding-left: 0.125em;
        transition: background-color 0.125s ease-in, color 0.125s ease-in;
    }


    tr th {
        border-right: 2px solid @dv-c-body;
        border-bottom-color: transparent;
        padding: 4px 12px 4px 0;
        text-align: right;
    }

    th, td {
        border-bottom: 1px solid @dv-c-idle;
        padding: 4px 4px 4px 4px;
    }

    td {
        padding-right: 0.5em;
    }

    td:first-child,
    th:first-child {
        padding-left: 0.25em;
        padding-right: 0.5em;
    }
    tr:last-child td {
        border-bottom-color: transparent;
    }

    tr:hover,
    tr.active:hover {
        background: fade(@dv-c-background, 10%);
        // color: white;
    }
}

</style>
