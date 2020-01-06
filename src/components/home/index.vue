<style lang='less'>
  .app-home-vue {
    .home-part-body {
      height: 350px;

      .echarts-vue {
        height: 350px;
      }
    }

    .home-part-body2 {
      height: 420px;

      .echarts-vue {
        height: 420px;
      }
    }

    .progress-div {
      > p {
        padding: 8px 0;
      }

      .h-progress {
        &-title {
          color: @dark2-color;
          font-size: 15px;
        }

        &-text {
          width: 40px;
        }
      }
    }
  }
</style>
<template>
  <div class="app-home-vue frame-page">
    <Row :space="30">
      <Cell :xs='24' :sm='24' :md='24' :lg='12' :xl='12'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">用户</div>
          </div>
          <div class="h-panel-body">
            <Row type="flex" align="middle">
              <Cell :width="12">
                <Avatar :src="avatar(user.avatar)" :width="180" fit="contain" noInfo></Avatar>
              </Cell>
              <Cell :width="12">
                <div>
                  <div style="font-size: 18px;">{{user.username}},欢迎~</div>
                  <p class="dark2-color">{{user.deptName}}</p>
                  <p class="dark2-color">{{user.roleName}}</p>
                </div>
              </Cell>
              <Cell :width="24">
                <div>
                  <p style="font-size: 18px;margin-left: 8px;">听首歌吧~</p>
                  <input type="text" v-model="keyword" placeholder="输入歌名或者歌手名~">
                  <Button color="green" style="margin-left: 8px;" @click="searchMusic">搜索</Button>
                  <br>
                  <ul>
                    <li v-for="(item,index) in musics" :key="index" style="margin: 3px;">
                      {{item.songName}}-{{item.singer}} &nbsp;&nbsp;
                      <span class="h-tag h-tag-green" v-if="item.platformEnum==='QQ_MUSIC'" style="font-size: 10px;">QQ音乐</span>
                      <span class="h-tag h-tag-red" v-if="item.platformEnum==='CLOUD_MUSIC'" style="font-size: 10px;">网易云</span>
                      &nbsp;&nbsp;
                      <i class="icon-play" @click="playMusic(item)"></i>
                    </li>
                  </ul>
                </div>
              </Cell>
            </Row>
          </div>
        </div>
      </Cell>
      <Cell :xs='24' :sm='24' :md='24' :lg='12' :xl='12'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">近七日系统访问情况</div>
          </div>
          <div class="h-panel-body">
            <Chart :options="data" key="loginData"></Chart>
          </div>
        </div>
      </Cell>
      <Cell :xs='24' :sm='24' :md='24' :lg='12' :xl='12'>
        <div class="h-panel">
          <div class="h-panel-bar">
            <div class="h-panel-title">音乐模块</div>
          </div>
          <div class="h-panel-body">
            <Row type="flex" align="middle">
              <Cell :width="6">
                <Avatar :src="song.img" :width="85" fit="contain" v-if="song.songId" noInfo>
                </Avatar>
              </Cell>
              <Cell :width="18">
                <div style="font-size: 18px;">{{song.songName}}</div>
                <p class="dark2-color">{{song.singer}}</p>
              </Cell>
            </Row>
            <audio ref="audio" controls="controls"></audio>
          </div>
        </div>
      </Cell>
    </Row>

  </div>
</template>
<script>


  export default {
    data() {
      return {
        user: this.$store.getters.account,
        musics: [],
        keyword: '',
        song: {},
        data: {
          tooltip: {
            trigger: 'axis'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: []
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} '
              }
            }
          ],
          series: [
            {
              name: '访问次数',
              type: 'line',
              data: [],
              smooth: true,
            },
          ]
        }
      };
    },
    methods: {
      avatar(avatar) {
        avatar = avatar ? avatar : 'avatar.png'
        return require(`@/images/avatar/${avatar}`)
      },
      searchMusic() {
        this.$axios.get('/music/v1/search', {keyword: this.keyword}).then(res => {
          this.musics = res.data
        })
      },
      playMusic(song) {
        this.$axios.postJson('/music/v1/song', song).then(res => {
          this.song = res.data
          this.$refs['audio'].src = res.data.songUrl
          this.$refs['audio'].play()
        })
      },
      getLoginCount() {
        this.$axios.get('/rbac/loginLog/countLoginNum').then(res => {
          this.data.xAxis[0].data = res.data.date
          this.data.series[0].data = res.data.count
        })
      }
    },
    mounted() {
      this.getLoginCount()
    }
  };
</script>
