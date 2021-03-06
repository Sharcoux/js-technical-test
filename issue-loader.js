//Global data tables
var authors = {};//Contains per author data
var posts = [];//Contains every posts

//Load and display a new issue
function loadIssue(url, callback) {
    $.get(url).done(function(data) {
        //Clear data
        authors = {};
        posts = [];
        //Load and display issue
        parseData(data, function(id, title, author, authors, posts, commentsURL) {
            displayIssue(id, title, author, authors, posts, commentsURL);
            callback();//Done displaying issue
        });
    }).fail(function() {
        alert("No issue found with this url");
    });
}

//Display an issue given the data loaded
function displayIssue(id, title, author, authors, posts, commentsURL) {
    //Display the title
    $("#issue-title").html(title+" #"+id);
    
    //Display thread title
    $("#issue-thread").html("<h3 id='thread-title' class='title'>Issue opened by "+author+"</h3>");
    
    //Display each post
    for(var i=0; i<posts.length; i++) {
        var post = posts[i];
        //class for author posts
        var authorClass = post.author==author ? " author" : "";
        var avatar = authors[post.author].avatar;
        $("#issue-thread").append("<div id='"+post.id+"' class='comment "+post.author+"-comment"+authorClass+"'><div class='avatar'><img src='"+avatar+"' alt='"+post.author+"'></div><div class='triangle'></div><div class='content'>"+post.content+"</div></div>");
    }
    
    //Display chart
    drawChart(authors,"issue-chart");
    
    //Display participant names
    $("#issue-participants").html("<h3 class='title'>Participants</h3><ul id='participant-list'></ul>");
    for(participant in authors) {
        var avatar = authors[participant].avatar;
        $("#participant-list").append("<li id='"+participant+"' class='participant'><div class='avatar'><img src='"+avatar+"' alt='' /></div><div class='content participant-name'>"+participant+"</div></li>");
    }
    
    //Animations
    $(".participant").on("click",function() {
        var name = $(this).find(".content").first();
        console.log(name.html());
        if(!name.hasClass("stroke")) {name.addClass("stroke");}
        else {name.removeClass("stroke");}
        $("."+$(this).attr('id')+"-comment").toggle('blind',1000);
    });
    
    //Add a reply button
    $("#issue-thread").append("<div id='reply'><form method='POST' id='reply-form'><textarea id='reply-content' placeholder='Leave a reply...' type='text'></textarea><br/><input id='reply-button' type='submit' class='button' /></form></div>");
    $("#reply-button").on("click",function() {$.post(commentsURL,'{"body":"'+$("#reply-content").val()+'"}');});
    $('#reply-content').on( 'change keyup keydown paste cut', function (){$(this).height(this.scrollHeight);});//Resize textarea as needed
}

//gets general data from github API
function parseData(json, callback) {
    //Issue data
    var issueTitle = json.title;
    var issueId = json.number

    //Original author data
    var author = json.user.login;
    var content = json.body;
    var avatar = json.user.avatar_url;
    var id = json.id;
    var words = wordCount(content);

    //update data tables
    authors[author] = {"words":words,"avatar":avatar}
    posts.push({"author":author,"content":content,"id":id});
    
    //load comments
    $.get(json.comments_url).done(function(data) {
        parseComments(data);
        callback(issueId, issueTitle, author, authors, posts, json.comments_url);//Done reading data
    });
}

//Reads comments from github API
function parseComments(json) {
    for(var i=0; i<json.length; i++) {
    
        //Per comment data
        var comment = json[i];
        var author = comment.user.login;
        var content = comment.body;
        var avatar = comment.user.avatar_url;
        var id = comment.id;
        var words = wordCount(content);

        //Create a new author entry if necessary
        if(!authors[author]) {
            authors[author] = {"words":0,"avatar":avatar}
        }
        
        //update data tables
        authors[author].words += words;
        posts.push({"author":author,"content":content,"id":id});
        
    }
}

//Words count
function wordCount(sentence) {
    var matches = sentence.match(/(\w+)/g);//Group words
    var words = (matches ? matches.length : 0);//Matches is null for empty or white string
    return words;
}
