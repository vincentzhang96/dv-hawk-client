<template>
  <div>
    <div class="app">
      <div class="top-bar">
        <div class="title">HAWK</div>
        <button v-on:click="clear">Clear</button>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <label for="c2schk">
          <input type="checkbox" id="c2schk" v-model="showC2S" />
          Client to Server
        </label>

        <label for="s2cchk">
          <input type="checkbox" id="s2cchk" v-model="showS2C" />
          Server to Client
        </label>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <label for="autoscroll">
          <input type="checkbox" id="autoscroll" v-model="autoScroll" />
          Autoscroll
        </label>
      </div>
      <div class="packet-list" ref="list">
        <div v-for="p in packets" :key="p.id" v-if="showC2S && (p.direction == 0) || showS2C && (p.direction == 1)">
          <div class="packet-wrapper" id="p.id">
            <div class="packet" :direction="p.direction">
              <div class="packet-header">
                <div class="size">{{p.size}} bytes</div>
                <div class="timestamp">{{p.timestamp.toLocaleString()}}</div>
              </div>
              <packet-parse :packet="p" />
              <hex-view :data="p.data" />
            </div>
          </div>
        </div>
        <div ref="bottom"></div>
      </div>
    </div>
  </div>
</template>

<script>
import PacketScroller from '@/components/PacketScroller';
import HexView from '@/components/HexView';
import PacketParse from '@/components/PacketParse';


export default {
  name: 'App',
  components: {
    PacketScroller,
    HexView,
    PacketParse
  },
  data: function() {
    return {
      connected: false,
      websocket: null,
      packets: [],
      showC2S: true,
      showS2C: true,
      c2sFilterId: 0,
      autoScroll: true,
    }
  },
  created() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      this.connected = false;
      this.websocket = new WebSocket("ws://localhost:14301");
      this.websocket.binaryType = 'arraybuffer';
      this.websocket.onopen = this.onOpen;
      this.websocket.onmessage = this.onMessage;
    },
    onOpen(event) {
      this.connected = true;
    },
    onMessage(event) {
      // console.log(event);
      let d = event.data;
      let dv = new DataView(d);

      let direction = dv.getUint8(0);
      let size = dv.getUint32(1, true);
      let data = d.slice(5 + (direction == 0 ? 2 : 5));
      let now = new Date();
      let packet = {
        timestamp: now,
        id: now.getTime() + ' ' + direction + ' ' + size,
        direction: direction,
        size: size,
        data: data,
      };

      this.newPacket(packet);
    },
    newPacket(packet) {
      this.packets.push(packet);
      if (this.autoScroll) {
        var bottom = this.$refs.bottom;
        var list = this.$refs.list;
        // list.scrollTop = list.scrollHeight;
        setTimeout(() => {
          bottom.scrollIntoView();
        }, 100);
      }
    },
    clear() {
      this.packets = [];
    }
  }
}
</script>

<style lang="less">
.app {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background-color: #eee;

  .top-bar {
    height: 54px;
    border-bottom: 1px solid black;
    padding: 4px 16px;

    .title {
      letter-spacing: 0.1em;
    }
  }

  .packet-list {
    position: absolute;
    top: 54px;
    bottom: 0;
    overflow-y: scroll;
    width: 100%;
    .packet-wrapper {
      width: 100%;
      position: relative;

      .packet {
        background-color: #ddd;
        width: 50%;
        border-top: 1px solid #004488;
        padding: 4px 4px 4px 4px;

        &[direction="1"] {
          margin-left: 50%;
          &::before {
            content: "S ➡C";
            font-size: 12px;
            position: absolute;
            top: -4px;
            right: 4px;
          }
        }

        &[direction="0"] {
          &::before {
            content: "C ➡S";
            font-size: 12px;
            position: absolute;
            top: -4px;
            left: 4px;
          }

          .packet-header {
            justify-content: flex-end;
          }
        }

        .packet-header {
          display: flex;
          flex-direction: row;
          font-size: 12px;
          width: 100%;

          & > div {
            margin-left: 8px;
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
}

html, body {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
