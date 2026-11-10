'use strict';
// Select the existing experiment through its normal control; no numerical fork.
if(new URLSearchParams(location.search).get('view')==='electrons'){
  document.documentElement.classList.add('electrons-only');
  document.getElementById('tab-electrons').click();
}
