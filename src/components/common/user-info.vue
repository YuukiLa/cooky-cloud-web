<template>
  <div>
    <Row :space-x="20" type="flex" justify="space-around" align="middle">

      <Cell :width='6'>
        <Avatar :src="avatar(user.avatar)" :width="235" fit="contain" noInfo></Avatar>
      </Cell>
      <Cell :width='10' class="info">
          <Row class="info-item">
            <Cell :width="5"><i class="icon-user"></i> 用户名</Cell>
            <Cell :width="18">{{user.username}}</Cell>
          </Row>
        <Row class="info-item">
          <Cell :width="5"><i class="icon-man-woman"></i> 性别</Cell>
          <Cell :width="18">{{user.sex==0?'男':user.sex==1?'女':'保密'}}</Cell>
        </Row>
          <Row class="info-item">
            <Cell :width="5"><i class="icon-tree"></i> 部门</Cell>
            <Cell :width="18">{{user.deptName}}</Cell>
          </Row>
          <Row class="info-item">
            <Cell :width="5"><i class="icon-envelop"></i> 邮箱</Cell>
            <Cell :width="18">{{user.email}}</Cell>
          </Row>
          <Row class="info-item">
            <Cell :width="5"><i class="icon-address-book"></i> 电话</Cell>
            <Cell :width="18">{{user.phone}}</Cell>
          </Row>
          <Row class="info-item">
            <Cell :width="5"><i class="icon-price-tag"></i> 角色</Cell>
            <Cell :width="18">{{user.roleName}}</Cell>
          </Row>
      </Cell>
<!--      <Cell :width='5'>-->
<!--      </Cell>-->
    </Row>
  </div>
</template>

<script>
    export default {
        name: "user-info",
        props: {
            user: {
                type: Object,
                default: null
            }
        },
        methods: {
            avatar(avatar) {
                avatar = avatar ? avatar : 'avatar.png'
                return require(`@/images/avatar/${avatar}`)
            }
        }
    }
</script>

<style scoped>
  .info {
    font-size: 20px;
  }
  .info-item {
    margin: 20px 0 20px 0;
  }
</style>
