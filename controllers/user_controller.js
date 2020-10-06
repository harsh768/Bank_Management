const User = require('../models/user');
const forgot_password_mailer = require('../mailers/forgot_password_mailer');

module.exports.create = function(req,res)
{
    if (req.body.password != req.body.confirm_password){
        req.flash('error','Passwords entered are different' );
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('*********error in creating user while signing up',err); return}

                var x = Math.floor((Math.random() * 100000000100) + 100000000000);
                
                user.account_number = x;

                req.flash('success','New User created');
                return res.redirect('/user/login');
            })
        }else{
            req.flash('success','Email Id already there!');
            return res.redirect('back');
        }

    });
}

module.exports.balance = function(req,res)
{
    User.findById(req.params.id,function(err,user){
        return res.render('balance',{
            title : "Deposit money",
            balance : user.amount
        })
    })

}

module.exports.details = function(req,res)
{
    User.findById(req.params.id,function(err,user){
        return res.render('details',{
            title : "Account Details",
            user : user
        })
    })

}

module.exports.update = function(req,res)
{
    return res.render('updateDetails',{
        title : "Update Account Details"
    })

}

module.exports.update_db = function(req,res)
{
    User.findById(req.params.id,function(err,user){
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.save();

        return res.redirect(`/user/account-details/${user.id}`);
    })

}

module.exports.profile = function(req,res)
{
    return res.render('personal_banking',{
        title : "Profile",
    });
}

module.exports.login = function(req,res)
{
    if(req.isAuthenticated())
    {
        console.log(req.flash , req.user) ;
        return res.redirect(`/users/profile`);

    }
    return res.render('login',{
        title : "Login Page",
    });
}

module.exports.forgot_password = function(req,res)
{
    return res.render('forgot_password',{
        title : "Forgot password",
    });
}

module.exports.forgot_password_form = function(req,res)
{
    User.findOne({email : req.body.email},function(err,user){
        if(user){
            forgot_password_mailer.forgotpassword(user);
            req.flash('success', "Link sent on Email Id");
            return res.redirect('/');
        }

        else {
            req.flash('error',"No existing User with entered Email Id");
            return res.redirect('back');
        }
    });


}

module.exports.resetpassword = function(req,res)
{
    return res.render('resetpassword',{
        title : "Reset Password"
    });
}

module.exports.resetpasswordform = function(req,res)
{
    User.findOne({email : req.body.email},function(err,user){

        if(user)
        {
            if(req.body.password == req.body.confirm_password)
            {
                user.password = req.body.password;
                user.save();
                req.flash('success',"Password changed Successfully");
                return res.redirect('/user/login');
            }

            else {
                req.flash('error',"password entered are different");
                return res.redirect('back');
            }
        }

        else {
            req.flash('error',"No existing User with entered Email Id");
            return res.redirect('back');
        }

    });

}



module.exports.sign_up = function(req,res)
{
    return res.render('sign_up',{
        title : "Sign-Up Page"
    });
}

module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully');    //This is currently in req to pass in res create own middleware
    return res.redirect('/');
}

//Signing out
module.exports.destroySession = function(req,res)
{
    req.logout();
    req.flash('success','You have logged out!');

    return res.redirect('/');
}

