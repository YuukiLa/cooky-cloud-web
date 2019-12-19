<style lang="less">
  @gradient-color: #3788ee;
  @bg-color: #f7f8fa;
  @title-color: #3a3a3a;
  @text-color: #7e7e7e;
  @placeholder-color: #7e7e7e;
  .login-vue {
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: @bg-color;

    .login-container {
      width: 350px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      .login-content {
        letter-spacing: 2px;
        background: #FFF;
        padding: 70px 30px 20px;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.06);
        border-radius: 3px;
        box-sizing: border-box;

        > div {
          margin: 30px 0;

          &.login-input {
            position: relative;

            .placeholder {
              position: absolute;
              color: @placeholder-color;
              top: 6px;
              font-size: 16px;
              transition: all .2s;
              left: 0;
              pointer-events: none;
            }

            input {
              font-size: 16px;
              padding: 8px 0;
              height: 40px;
              width: 100%;
              border: none;
              border-radius: 0;
              border-bottom: 1px solid #d3d3d3;
              box-shadow: inset 0 0 0 1000px #fff;
              outline: none;
              box-sizing: border-box;
              transition: .3s;
              font-weight: 200;

              &:focus {
                border-bottom-color: @gradient-color;
                box-shadow: inset 0 0 0 1000px #fff;
              }
            }

            input:focus + .placeholder, .placeholder.fixed {
              font-size: 13px;
              top: -16px;
            }

            input:-webkit-autofill + .placeholder {
              font-size: 13px;
              top: -16px;
            }
          }

          &.login-title {
            font-size: 30px;
            color: @title-color;
            line-height: 1;
            margin: -16px 0px 40px;
            font-weight: 200;
          }

        }

        > .buttonDiv {

          .h-btn {
            padding: 12px 0;
            font-size: 18px;
            opacity: .8;
            border-radius: 3px;
            background: @gradient-color;
            border-color: @gradient-color;

            &:hover {
              opacity: 1;
              background: @gradient-color;
              border-color: @gradient-color;
            }
          }
        }
      }

      .copyright {
        letter-spacing: 1px;
        margin-top: 30px;
        color: @text-color;

        a {
          color: @text-color;
        }
      }
    }
  }
</style>

<template>
  <div class="login-vue">
    <div class="login-container">
      <div class="login-content">
        <div class="login-title">Cooky Cloud 登录</div>
        <Form
          ref="form"
          :validOnChange="true"
          :showErrorTip="false"
          :labelWidth="65"
          labelPosition="left"
          :rules="validationRules"
          :model="loginForm"
        >
          <FormItem label="用户名" prop="username">
            <div class="h-input h-input-prefix-icon">
              <input type="text" v-model="loginForm.username"/>
              <i class="h-icon-user"></i>
            </div>
          </FormItem>
          <FormItem label="密码" prop="username">
            <div class="h-input h-input-prefix-icon">
              <input type="password" v-model="loginForm.password"/>
              <i class="h-icon-lock"></i>
            </div>
          </FormItem>
          <FormItem label="验证码" prop="code" :showLabel="false">
            <h-row type="flex" align="middle" :space-x="10">
              <h-cell :width="10">
                <div class="h-input h-input-prefix-icon">
                  <input type="text" v-model="loginForm.code"/>
                  <i class="h-icon-link"></i>
                </div>
              </h-cell>
              <h-cell :width="10">
                <img :src="codeUrl" @click="updateKey"/>
              </h-cell>
            </h-row>
          </FormItem>
        </Form>
        <div class="buttonDiv">
          <Button :loading="loading" block color="primary" size="l" @click="submit">登录</Button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                validationRules: {
                    required: ['username', 'password', 'code']
                },
                loginForm: {
                    username: 'yuuki',
                    password: '123456',
                    key: '',
                    code: ''
                },
                baseParam: {
                    grant_type: 'password',
                    client_secret: '123456',
                    client_id: 'cooky',
                    scope: 'app'
                },
                loading: false
            };
        },
        computed: {
            codeUrl() {
                return `${process.env.VUE_APP_BASE_API}/auth/captcha?key=${this.loginForm.key}`
            }
        },
        mounted() {
            this.updateKey()
        },
        methods: {
            updateKey() {
                this.loginForm.key = Utils.uuid()
            },
            submit() {
                let validResult = this.$refs.form.valid();
                if (validResult.result) {
                    this.loading = true
                    this.$axios.post('/auth/oauth/token', {...this.loginForm, ...this.baseParam}).then(res => {
                        if(res.code) {
                            this.$Message.error(res.msg)
                            this.loading = false
                            return
                        }
                        Utils.saveLocal("USER_TOKEN", res.access_token)
                        Utils.saveLocal("USER_REFRESH_TOKEN", res.refresh_token)
                        Utils.saveLocal("EXPIRES_IN",res.expires_in*1000+new Date().getTime())
                        this.$axios.get("/auth/user").then(res => {
                            if(res.code === 500) {
                                this.loading = false
                                this.$Message.error(res.msg)
                                localStorage.clear()
                                return
                            }
                            this.$store.dispatch('updateAccount', res.principal)

                            this.loading = false
                            window.location = '/'
                        }).catch(e => {

                        })

                    }).catch(e => {
                        log(e)
                        this.loading = false
                        this.updateKey()
                    })
                    // this.loading = true;
                    // Utils.saveLocal("USER_TOKEN", "XXXXXXXXXXXXXXXXXX")
                    // this.loading = false;
                    // window.location = '/';
                }
                // R.Login.login(Login.dispose(this.login)).then(resp => {
                //   if (resp.ok) {
                //     let msg = resp.body;
                //     Utils.saveLocal('token', msg.value);
                //     window.location = '/';
                //   }
                //   this.loading = false;
                // });
            }
        }
    };
</script>
