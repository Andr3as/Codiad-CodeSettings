<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License. 
 * See http://opensource.org/licenses/MIT for more information. 
 * This information must remain intact.
 */
    include_once('../../common.php');

    class settings {
        
        public function load() {
            return file_get_contents($this->getFilePath());
        }
        
        public function open() {
            $this->existDir();
            $msg            = array();
            $msg['content'] = file_get_contents($this->getFilePath());
            $msg['name']    = $this->getFileName();
            $msg['mtime']   = filemtime($this->getFilePath());
            if ($msg['content'] !== false) {
                $msg['status'] = "success";
            } else {
                $msg['status'] = "error";
                $msg['message'] = "Failed to open file!";
            }
            return json_encode($msg);
        }
        
        public function save($content) {
            $this->existDir();
            if (file_put_contents($this->getFilePath(), $content) !== false) {
                return '{"status":"success","message":"Settings saved"}';
            } else {
                return '{"status":"error","message":"Failed to save settings!"}';
            }
        }
        
        public function existDir() {
            if(!file_exists($this->getFilePath())) {
                @mkdir(DATA."/config");
                file_put_contents($this->getFilePath(), json_encode(array()));
            }
        }
        
        public function getFilePath() {
            return DATA."/config/".get_called_class().".".$_SESSION['user'].".json";
        }
        
        public function getFileName() {
            return basename($this->getFilePath());
        }
        
        static public function getWorkspacePath($path) {
            if (strpos($path, "/") === 0) {
                //Unix absolute path
                return $path;
            }
            if (strpos($path, ":/") !== false) {
                //Windows absolute path
                return $path;
            }
            if (strpos($path, ":\\") !== false) {
                //Windows absolute path
                return $path;
            }
            return "../../workspace/".$path;
        }
    }
?>