<?php
/*
 * Copyright (c) Codiad & Andr3as, distributed
 * as-is and without warranty under the MIT License. 
 * See [root]/license.md for more information. This information must remain intact.
 */

    require_once('../../common.php');
    require_once('class.settings.php');
    
    checkSession();
    error_reporting(0);
    
    switch($_GET['action']) {
        
        case 'open':
            $settings = new settings();
            echo $settings->open();
            break;
            
        case 'save':
            $settings = new settings();
            if (isset($_POST['content'])) {
                echo $settings->save($_POST['content']);
            } else {
                echo '{"status":"error","message":"Missing Parameters!"}';
            }
            break;
        case 'load':
            $settings = new settings();
            echo $settings->load();
            break;
        default:
            echo '{"status":"error","message":"No Type"}';
            break;
    }
?>