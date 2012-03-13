# jQuery Mobile Fixed Toolbar Legacy Polyfill 

Brings support to browsers that don't natively support position:fixed (like iOS4)

- Copyright 2012 Filament Group, Inc.
- License Dual MIT or GPLv2
- Author @scottjehl, Filament Group, Inc.

## Usage

Include `jquery.mobile.fixedToolbar.polyfill.css` and `jquery.mobile.fixedToolbar.polyfill.js` just after your jQuery and jQuery Mobile references, in the head of your document. Note that the JS for this fix must be included just after jQuery Mobile itself, so that it can execute before toolbars are initialized.