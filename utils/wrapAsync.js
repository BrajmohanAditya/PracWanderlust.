// step - 11 : Adding server side validation, in step 10 we have added client side validation 
function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next);
  };
}
module.exports = wrapAsync;
//---


// WrapAsink is better version of try catch validation. 