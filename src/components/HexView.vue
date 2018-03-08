<template>
<div class="hexview">
    <div class="hex dump" v-html="hexDump">
    </div>
    <div class="ascii dump" v-html="asciiDump">
    </div>
</div>
</template>

<script>
const LINE_WIDTH = 16;
export default {
    name: 'hex-view',
    props: ["data"],
    computed: {
        hexDump() {
            let ret = '';
            let b = new Uint8Array(this.data);
            let lineLen = 0;
            for (let i = 0; i < b.length; ++i) {
                let v = b[i];
                ret += ("00" + v.toString(16)).substr(-2) + " ";
                ++lineLen;
                if (lineLen % LINE_WIDTH == 0) {
                    ret += "<br/>";
                    lineLen = 0;
                }
            }

            return ret;
        },
        asciiDump() {
            let ret = '';
            let b = new Uint8Array(this.data);
            let lineLen = 0;
            for (let i = 0; i < b.length; ++i) {
                let v = b[i];
                if (v < 32 || v > 126) {
                    ret += ".";
                } else {
                    ret += String.fromCharCode(v);
                }

                ++lineLen;
                if (lineLen % LINE_WIDTH == 0) {
                    ret += "<br/>";
                    lineLen = 0;
                }
            }

            return ret;
        }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
.hexview {
    min-width: 100px;
    display: flex;
    flex-direction: row;

    .hex {
        padding: 2px 4px;
        flex: 0 0 400px;
        background-color: #aaa;
        font-family: "Consolas", 'Courier New', Courier, monospace;
    }

    .ascii {
        padding: 2px 4px;
        flex: 1 0 auto;
        background-color: #999;
        font-family: "Consolas", 'Courier New', Courier, monospace;
    }
}
</style>
