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
+ custom (you supply a function that returns a boolean, you are supplied the value for the input as a parameter

###Here is you you would import it into an Aurelia app
```javascript
import {inject} from 'aurelia-framework';
import {RSValidation} from '../services/rocketstorm-validation';

@inject(RSValidation)
export class Register {

    constructor(validation){
        
        this.validation = validation;   
        
    }// ctor
```
or you can "new' it up
```javascript
var validation = new RSValidation();
```

###Here is an example of a form element:

```html
<div class="input-wrapper">

    <div class="input-icon-wrapper">
        <i class="fa fa-user"></i>
    </div><!-- input-icon-wrapper -->

    <input placeholder="username" type="text" value.bind="userName" class="input" name="userName" id="userName" />

</div><!-- input-wrapper -->
```

###required field
**the first parameter to any of the validation methods is the id for the input element;

```javascript
attached(){
    this.validation.require('userName');            
}
```
document.getElementById() is used so if using aurelia initialize validation in the attached() method

###email field
```html
<div class="input-wrapper sub">

    <div class="input-icon-wrapper">
        <i class="fa fa-envelope"></i>
    </div><!-- input-icon-wrapper -->

    <input placeholder="email" type="text" value.bind="email" class="input" name="email" id="email" />

</div><!-- input-wrapper -->
```

```javascript
attached(){
    this.validation.email('email');
}
```

###Non-Parameterized Validators can be passed as an array
```javascript
attached(){
    this.validation.require(['password', 'email']);
}
```

###minlength field
```javascript
attached(){
    this.validation.minLength('userName', 6);
}
```

###maxlength field
```javascript
attached(){
    this.validation.maxLength('userName', 8);
}
```

###regex field
```javascript
attached(){
   this.validation.regEx("userName", /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})$/);
}
```

###range field
```javascript
attached(){
   this.validation.range('password', 4, 8);
}
```

###compare field
```javascript
attached(){
   this.validation.compare('passwordConfirm', 'password');
}
```

###custom field
```javascript
attached(){
   this.validation.custom('userName', (val) => {
            return val.indexOf('1') > -1;
        });
}
```

###2 convienence methods
```javascript
    this.validation.getValidators();
    this.validation.getValidatorByElementId(id);
```

###Validate a form (all the validators you intialized)
validate() returns a promise with an object that specifies if the whole form is valid, and a collection 
of all the validators that are invalid
```javascript
register(){

        this.validation.validate().then(result => {
        
            console.log('validation', result);
        
        });

    }// register()
```
![alt text](https://github.com/rocketstormstudios/rocketstorm-validation/blob/master/validation.PNG "validation object")
