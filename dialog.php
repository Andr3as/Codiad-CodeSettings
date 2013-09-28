<!--
    Copyright (c) Codiad & Andr3as, distributed
    as-is and without warranty under the MIT License. 
    See http://opensource.org/licenses/MIT for more information. 
    This information must remain intact.
-->
<form id="hotkey">
    <label>Current key bindings</label>
    <div id="hotkey_div">
        <table id="hotkey_list"></table>
    </div>
    <button onclick="codiad.modal.unload(); return false;">Close</button>
    <button onclick="codiad.CodeSettings.edit(); return false;">My key bindings</button>
    <script>
        codiad.CodeSettings.show();
    </script>
</form>