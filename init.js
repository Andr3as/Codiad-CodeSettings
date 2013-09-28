/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information. 
 * This information must remain intact.
 */

(function(global, $){
    
    var codiad = global.codiad,
        scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src.split('?')[0],
        curpath = path.split('/').slice(0, -1).join('/')+'/';

    $(function() {
        codiad.CodeSettings.init();
    });
    
    codiad.CodeSettings = {
        
        path: curpath,
        file: "",
        open: false,
        keymap: null,
        
        init: function() {
            var _this = this;
            this.$pSave = this.save.bind(this);
            this.$cSave = codiad.active.save.bind(this);
            //Load keymap
            this.load();
            //Set keymap
            amplify.subscribe("active.onOpen", function(path){
                //Overwrite save commands
                var manager = codiad.editor.getActive().commands;
                manager.addCommand({
                    name: 'Save',
                    bindKey: "Ctrl-S",
                    exec: function () {
                        codiad.active.save();
                    }
                });
                _this.setKeys();
            });
            amplify.subscribe("active.onFocus", function(path){
                if (_this.open) {
                    if (path === _this.file) {
                        _this.addCommands();
                    } else {
                        _this.restoreCommands();
                    }
                }
            });
            amplify.subscribe("active.onClose", function(path){
                if (_this.file === path) {
                    _this.open = false;
                }
            });
        },
        
        showDialog: function() {
            codiad.modal.load(400, this.path+"dialog.php");
        },
        
        load: function() {
            var _this = this;
            $.getJSON(this.path+"controller.php?action=load", function(json){
                json.keys       = json.keys || {};
                _this.keymap    = json.keys;
            });
        },
        
        setKeys: function() {
            if (codiad.editor.getActive() !== null) {
                var manager = codiad.editor.getActive().commands;
                //var command;
                for (var i = 0; i < this.keymap.length; i++) {
                    var element = this.keymap[i];
                    manager.addCommand({
                        name: element.name,
                        bindKey: element.bindKey,
                        exec: manager.byName[element.name].exec
                    });
                }
            }
        },
        
        edit: function() {
            var _this = this;
            //Open file and load currrent settings
            $.getJSON(this.path+"controller.php?action=open", function(json){
                if (json.status !== "error") {
                    _this.file = json.name;
                    _this.open = true;
                    codiad.modal.unload();
                    codiad.active.open(json.name, json.content, json.mtime, false, true);
                } else {
                    codiad.message.error(json.message);
                }
            });
        },
        
        save: function() {
            var _this = this;
            var content = codiad.editor.getContent();
            $.post(this.path+"controller.php?action=save", {"content": content}, function(data){
                var json = JSON.parse(data);
                if (json.status !== "error") {
                    $('li[data-path="'+_this.file+'"]').removeClass('changed');
                } else {
                    codiad.message.error(json.message);
                }
            });
        },
        
        addCommands: function() {
            if (codiad.editor.getActive() === null) {
                return false;
            }
            var manager = codiad.editor.getActive().commands;
            manager.commands.Save.exec = this.$pSave;
        },
        
        restoreCommands: function() {
            if (codiad.editor.getActive() === null) {
                return false;
            }
            var manager = codiad.editor.getActive().commands;
            manager.commands.Save.exec = this.$cSave;
        },
        
        show: function() {
            if (codiad.editor.getActive() === null) {
                codiad.message.error("Open file to display all commands!");
                return false;
            }
            var commands = codiad.editor.getActive().commands.byName;
            var buf = [];
            $.each(commands, function(i, item){
                buf.push(item);
            });
            buf.sort(function(a,b){
                var newBuf = [a.name,b.name];
                if (a === b) {
                    return 0;
                }
                newBuf.sort();
                if (newBuf[0] === a.name) {
                    return -1;
                } else {
                    return 1;
                }
            });
            $.each(buf, function(i, item){
                var element = "<tr><td>"+item.name+"</td><td>";
                if ($.isPlainObject(item.bindKey)) {
                    element += "Win: "+ item.bindKey.win;
                    element += " Mac: "+ item.bindKey.mac;
                } else {
                    element += item.bindKey;
                }
                element += "</td></tr>";
                $('#hotkey_list').append(element);
            });
            $('#hotkey_div').css('max-height', function(){
                return 0.6*window.innerHeight + "px";
            });
        }
    };
})(this, jQuery);