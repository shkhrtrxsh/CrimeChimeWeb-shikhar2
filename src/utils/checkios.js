function isIOS () {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes (navigator.platform)
  }

function isSafari () {
    return /^ ( (?!chrome|android).)*safari/i.test (navigator.userAgent);
}

export function isIOSSafari () {
    return isIOS () && isSafari ();
  }