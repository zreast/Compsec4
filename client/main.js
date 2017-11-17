angular.module('fileUpload', ['ngFileUpload'])
.controller('MyCtrl',['Upload','$window',function(Upload,$window){
    var vm = this;
    var key = 'hello?';
    var salt = CryptoJS.lib.WordArray.random(128/8);
    var iv = CryptoJS.lib.WordArray.random(128/8);

    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if form is valid
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(vm.file), key, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            var encryptedFile = new File([ciphertext], vm.file.name + '.encrypted', {
                type: vm.file.type,
                lastModified: vm.file.lastModified
            });
            vm.upload(encryptedFile);
        }
    }

    vm.upload = function (file) {
        console.log(file);
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data: {file: file} //pass file as data, should be user ng-model*/
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('Success ' + resp.config.data.file.name + ' uploaded.');
            } else {
                $window.alert('An error occured.');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    }
}]);