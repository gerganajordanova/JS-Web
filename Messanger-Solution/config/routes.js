const controllers = require('../controllers');
const restrictedPages = require('./auth');

module.exports = app => {
   app.get('/',controllers.home.index);
   app.get('/users/login',restrictedPages.isAnonymous,controllers.user.loginGet);
   app.post('/users/login',restrictedPages.isAnonymous,controllers.user.loginPost);
   app.get('/users/register',restrictedPages.isAnonymous,controllers.user.registerGet);
   app.post('/users/register',restrictedPages.isAnonymous,controllers.user.registerPost);
   app.post('/users/register',restrictedPages.isAnonymous,controllers.user.registerPost);
   app.get('/users/logout',restrictedPages.isAuthed,controllers.user.logout);
   app.post('/threads/find',restrictedPages.isAuthed ,controllers.thread.findThread);
   app.get('/thread/:username',controllers.thread.openThread);
   app.post('/thread/:username',controllers.thread.sendMessage);
   app.post('/block/:username',controllers.user.blockUser);
   app.post('/unblock/:username',controllers.user.unblockUser);
   app.post('/threads/remove/:threadId',controllers.thread.removeThread)
   
   
   app.all('*', (req, res) => {
    res.status(404);
    res.send('404 Not Found');
    res.end();
});
};