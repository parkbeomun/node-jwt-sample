const router = require('express').Router()
const controller = require('./user.contoller')


//get user list
router.get('/list', controller.list)
//post assign admin
router.post('/assign-admin/:username', controller.assignAdmin)
router.post('/cancel-admin/:username', controller.cancelAdmin)

module.exports = router;

//user 라우터의 경우, 라우터 내부의 모든 API 에 토큰검증이 필요하므로
//router/api/index.js 에서  authMiddleware 를 적용함
