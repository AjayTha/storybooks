const moment = require('moment');

module.exports = {
  truncate: function(str, len){
    if (str.length > len && str.length > 0) {
			var new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + '...';
		}
		return str;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="card-link" style="position: absolute; top: 2px;right: 2px;"><button class="btn btn-danger rounded-circle"><i class="fa fa-pencil" style="color: white;" ></i></button></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}