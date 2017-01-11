# rocketstorm-validation

This is a simple front end JavaScript form validation library. It is written in es2015 syntax. I wrote this as part of an Aurelia
application. I wanted to implement some specific features and this is my implementaion. This library can be uses as a service in an
Aurelia application or in any JavaScript project using es2015.

It has built in support for the folowwing validations:
+ required fields
+ email address fields
+ compare validator (like password comparisons)
+ minlength
+ maxlength
+ range
+ regex
+ custom (you supply a function that return a boolean, you are supplied the value for the input as a parameter

###Here is an example of a form:

```html
<form class="${show}">

            <div class="input-wrapper">

                <div class="input-icon-wrapper">
                    <i class="fa fa-user"></i>
                </div><!-- input-icon-wrapper -->

                <input placeholder="username" type="text" value.bind="userName" class="input" name="userName" id="userName" />

            </div><!-- input-wrapper -->

            <div class="input-wrapper sub">

                <div class="input-icon-wrapper">
                    <i class="fa fa-envelope"></i>
                </div><!-- input-icon-wrapper -->

                <input placeholder="email" type="text" value.bind="email" class="input" name="email" id="email" />

            </div><!-- input-wrapper -->

            <div class="input-wrapper sub">

                <div class="input-icon-wrapper">
                    <i class="fa fa-lock"></i>
                </div><!-- input-icon-wrapper -->

                <input placeholder="password" type="password" value.bind="password" class="input" name="password" id="password" />

            </div><!-- input-wrapper -->

            <div class="input-wrapper sub">

                <div class="input-icon-wrapper">
                    <i class="fa fa-lock"></i>
                </div><!-- input-icon-wrapper -->

                <input placeholder="confirm password" type="password" value.bind="passwordConfirm" class="input" name="passwordConfirm" id="passwordConfirm" />

            </div><!-- input-wrapper -->

            <button click.delegate="register()" class="button login">Register</button>

            <a href="#/profile/login" class="already">already have an account? login.</a>

        </form><!-- register form -->
```

