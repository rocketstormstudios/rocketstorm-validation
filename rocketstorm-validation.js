export class RSValidation{

    constructor(){

        this.validators = [];
        this.errors = [];
        this.hasBeenValidated = false;

        /*
         *  object to allow event handling by type name.
         *  example: this.validateChecked[required](validator);
         *  this mechanism makes sure the validation is only fired
         *  onblur and keyup after initial call to validate
         */
        this.validateChecked = {
            required: (validator) => { this.validateRequireChecked(validator); },
            email: (validator) => { this.validateEmailChecked(validator); },
            compare: (validator) => { this.validateCompareChecked(validator); },
            minlength: (validator) => { this.validateMinLengthChecked(validator); },
            maxlength: (validator) => { this.validateMaxLengthChecked(validator); },
            range: (validator) => { this.validateRangeChecked(validator); },
            regex: (validator) => { this.validateRegExChecked(validator); },
            custom: (validator) => { this.validateCustomChecked(validator); }
        };

    }// ctor

    /*
     *  method to get all the validators that have
     *  been initialized
     */
    getValidators(){

        return this.validators;

    }// getValidators()

    /*
     *  method to get a validator by the elements name
     */
    getValidatorByElementId(id){

        for(let validator of this.validators) {
            if(validator.id === id){
                return validator;
            }
        }

    }// getValidatorByElementId()

    validate(){

        let promise = new Promise((resolve, reject) => {        

            for(let validator of this.validators){

                for(let type of validator.types)

                    switch(type){
                    case 'required':
                        this.validateRequire(validator);
                        break;
                    case 'email':
                        this.validateEmail(validator);
                        break;
                    case 'compare':
                        this.validateCompare(validator);
                        break;
                    case 'minlength':
                        this.validateMinLength(validator);
                        break;
                    case 'maxlength':
                        this.validateMinLength(validator);
                        break;
                    case 'regex':
                        this.validateRegEx(validator);
                        break;
                    case 'custom':
                        this.validateCustom(validator);
                        break;

                }
            }

            /*
             *  if the state of the validator is invalid it is added
             *  to the errors collection and returned as part of the
             *  validate call, if there are any errors the form is invalid
             */
            let existing = false;
            for(let validator of this.validators){
                for(let v of this.errors){
                    if(v.id === validator.id){
                        existing = true;
                        break;
                    }
                }
            }

            for(let v of this.validators){
                if(v.state === 'invalid' && existing === false){
                    this.errors.push(v);
                }
            }

            if(this.errors.length === 0){
                resolve({valid: true, errors: this.errors});
            }
            else{
                resolve({valid: false, errors: this.errors});
            }

            this.hasBeenValidated = true;

        });

        return promise;

    }// validate()

    buildValidator(val, type, param, param2){

        if(typeof val === "string"){

            let existingValidator = this.getExistingValidator(val);

            if(existingValidator === null){

                let ele = document.getElementById(val);

                if(ele !== undefined){ 
                
                    let validator = {
                        id: val, 
                        element: ele, 
                        wrapper: ele.parentNode, 
                        icon: this.getIcon(ele.parentNode), 
                        state: 'initial', 
                        checkFunc: null,
                        invalidTypes: [],
                        persistentTypes: []
                    };        
                    
                    this.handleParameterTypes(validator, type, param, param2);

                    if(!validator.types){
                        validator.types = [];
                    }              

                    /*
                     *  function to be called on element blur and keyup
                     */
                    validator.checkFunc = (e) => {
                        for(let t of validator.types){
                            this.validateChecked[t](validator);
                        }

                        for(let t of validator.persistentTypes){
                            this.validateChecked[t](validator);
                        }
                    };

                    /*
                     *  future binding feature could be implemented here
                     *  if(onblurBound === true)
                     */
                    ele.onblur = validator.checkFunc;
                    ele.onkeyup = validator.checkFunc

                    /*
                     *  range is a persistent type
                     */
                    if(type !== 'range'){
                        validator.types.push(type);
                    }

                    this.validators.push(validator);

                }
                else{
                    throw new Error('string element id did not return a valid DOM element');
                }
            }
            else{

                this.handleParameterTypes(existingValidator, type, param, param2)

                if(type !== 'range'){
                    existingValidator.types.push(type);
                }
                

            }
        }//if type === string
        else if(Array.isArray(val)){

            for(let vall of val){

                let existingValidator = this.getExistingValidator(val);

                if(existingValidator === null){

                    let ele = document.getElementById(vall);

                    if(ele !== undefined){

                        let validator = {
                            id: vall, 
                            element: ele, 
                            wrapper: ele.parentNode, 
                            icon: this.getIcon(ele.parentNode), 
                            state: 'initial', 
                            checkFunc: null,
                            invalidTypes: [],
                            persistentTypes: []
                        };
                    
                        if(!validator.types){
                            validator.types = [];
                        }


                        validator.types.push(type);
                        

                        this.validators.push(validator);

                        /*
                         *  function to be called on element blur and keyup
                         */
                        validator.checkFunc = (e) => {
                            for(let t of validator.types){
                                this.validateChecked[t](validator);
                            }

                            for(let t of validator.persistentTypes){
                                this.validateChecked[t](validator);
                            }
                        };

                        /*
                         *  future binding feature could be implemented here
                         *  if(onblurBound === true)
                         */
                        ele.onblur = validator.checkFunc;
                        ele.onkeyup = validator.checkFunc

                    }
                    else{
                        throw new Error('string element id did not return a valid DOM element');
                    }
                }
                else{

                    existingValidator.types.push(type);
                }
            }
        }
        else{
            throw new Error(`cannot register ${type} validator, arg not of type string or array of strings`);
        }

    }// buildValidator()

    handleParameterTypes(validator, type, param, param2){

        if(type === 'compare'){
            let comp = document.getElementById(param);
            if(comp){
                validator.comparer = param;
                validator.comparerElement = comp;

                //1.) see if comparer has a validator
                let comparerValidator = null;
                for(let v of this.validators){
                    if(v.id === validator.comparer){
                        comparerValidator = v;
                        break;
                    }
                }

                //2.) rebind its behavior an also fire the validation for this validator
                if(comparerValidator !== null){
                    comparerValidator.element.onblur = (e) => {
                        for(let t of validator.types){
                            this.validateChecked[t](validator);
                        }

                        for(let t of comparerValidator.types){
                            this.validateChecked[t](comparerValidator);
                        }

                        for(let t of comparerValidator.persistentTypes){
                            this.validateChecked[t](comparerValidator);
                        }
                    };

                    comparerValidator.element.onkeyup = (e) => {
                        for(let t of validator.types){
                            this.validateChecked[t](validator);
                        }

                        for(let t of comparerValidator.types){
                            this.validateChecked[t](comparerValidator);
                        }

                        for(let t of comparerValidator.persistentTypes){
                            this.validateChecked[t](comparerValidator);
                        }
                    };
                }
                    //3.) just bind a check of this validator on blur
                else{

                    validator.comparerElement.onblur = (e) => {
                        for(let t of validator.types){
                            this.validateChecked[t](validator);
                        }
                    };

                }

            }
            else{
                throw new Error('string element id (for comparer) did not return a valid DOM element');
            }
        }

        if(type === 'range'){
            validator.minLength = param;
            validator.maxLength = param2;
            if(validator.persistentTypes === undefined){
                validator.persistentTypes = [];
            }
            validator.persistentTypes.push(type);
        }

        if(type === 'regex'){
            validator.pattern = param;
        }

        if(type === 'minlength'){
            validator.minLength = param;
        }

        if(type === 'maxlength'){
            validator.maxLength = param;
        }

        if(type === 'custom'){
            if(typeof param === 'function'){
                validator.customFunc = param;
            }
            else{
                throw new Error('custom validator requires a function as a parameter that evaluates to a bool');
            }
        }

    }// handleParameterTypes()

    getExistingValidator(val){

        for(let validator of this.validators){
            if(validator.id === val){
                return validator;
            }
        }

        return null;

    }// getExistingValidator()

    custom(val, func){

        this.buildValidator(val, 'custom', func);

    }// custom

    regEx(val, pattern){

        this.buildValidator(val, 'regex', pattern);

    }//regEx

    range(val, min, max){

        this.buildValidator(val, 'range', min, max);

    }// minLength()

    maxLength(val, max){

        this.buildValidator(val, 'maxlength', max);

    }// minLength()

    minLength(val, min){

        this.buildValidator(val, 'minlength', min);

    }// minLength()

    require(val){

        this.buildValidator(val, 'required');

    }//required()

    email(val) {

        this.buildValidator(val, 'email');

    }// email

    compare(val, comparer){

        this.buildValidator(val, 'compare', comparer);

    }// compare()

    getIcon(parent){

        for(let child of parent.children){
            if(child.classList){
                for(let cls of child.classList){
                    if(cls === 'input-icon-wrapper'){
                        return child;
                    }
                }
            }
        }

    }// getIcon()

    handleValidation(expression, validator, type){

        /*
        *   Validity is determined by the invalidTypes collection
        *   when this collection reaches 0, elemnt is valid, otherwise
        *   it is invalid
        */

        if(expression === true){

            if(validator.invalidTypes.indexOf(type) < 0){
                validator.invalidTypes.push(type);
            }

            let existing = false;
            for(let v of this.validators){
                if(v.id === validator.id){
                    existing = true;
                }
            }

            if(existing === false){
                this.errors.push(validator);
            }

            validator.state = 'invalid';
            validator.wrapper.classList.add('input-validation-error');
            validator.icon.classList.add('input-validation-error');
        }
        else{

            let typeIndex = validator.invalidTypes.indexOf(type);

            if(typeIndex > -1){
                validator.invalidTypes.splice(typeIndex, 1);
            }

            /*
             *  if 0 the validator is valid
             */
            if(validator.invalidTypes.length === 0){

                let index = this.errors.indexOf(validator);
                if(index > -1){
                    this.errors.splice(index, 1);
                }
                validator.state = 'valid';
                validator.wrapper.classList.remove('input-validation-error');
                validator.icon.classList.remove('input-validation-error'); 
            }
                           
        }

    }// handleValidation()

    validateCustom(validator){

        let value = !validator.customFunc(validator.element.value);
        this.handleValidation(        
            value, 
            validator, 
            'custom'
            );

    }// validateEmail()

    validateRegEx(validator){

        this.handleValidation(
            (validator.element.value === undefined || validator.pattern.test(validator.element.value) === false), 
            validator, 
            'regex'
            );

    }// validateEmail()

    validateEmail(validator){

        let emailPattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        this.handleValidation(
            (validator.element.value === undefined || emailPattern.test(validator.element.value) === false), 
            validator, 
            'email'
            );

    }// validateEmail()

    validateCompare(validator){

        this.handleValidation(
            (validator.element.value === undefined || validator.element.value === '' || validator.comparerElement.value.trim() !== validator.element.value.trim()), 
            validator,
            'compare'
            );

    }// validateRequireEmail()

    validateRequire(validator){

        this.handleValidation((validator.element.value === undefined || validator.element.value.length < 1), 
            validator,
            'required'
            );

    }// validateRequire()

    validateMinLength(validator){

        this.handleValidation((validator.element.value === undefined || validator.element.value.length < validator.minLength), 
            validator,
            'minlength'
            );

    }// validateRequire()

    validateMaxLength(validator){

        this.handleValidation((validator.element.value === undefined || validator.element.value.length > validator.maxLength), 
            validator,
            'maxlength'
            );

    }// validateRequire()

    validateRange(validator){

        this.handleValidation((validator.element.value === undefined || (validator.element.value.length < validator.minLength || validator.element.value.length > validator.maxLength)), 
            validator,
            'range'
            );

    }// validateRequire()

    validateCustomChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateCustom(validator);
        }
    }

    validateRegExChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateRegEx(validator);
        }
    }

    validateEmailChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateEmail(validator);
        }
    }

    validateCompareChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateCompare(validator);
        }
    }

    validateRequireChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateRequire(validator);
        }
    }

    validateMinLengthChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateMinLength(validator);
        }
    }

    validateRangeChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateRange(validator);
        }
    }

    validateMaxLengthChecked(validator){
        if(this.hasBeenValidated === true){
            this.validateMaxLength(validator);
        }
    }

}// ValidationService
