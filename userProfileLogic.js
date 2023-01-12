

setUI()
let profileUser = {}

let SearchParams = new URLSearchParams(window.location.search)
let userId = SearchParams.get("id")

if(userId == null){
    profileUser = getCurrUser()
    setUserProfile(profileUser)
}else{
    //console.log(userId)
    axios.get(`${baseUrl}/users/${userId}`)
    .then((response) => {
        profileUser = response.data.data
        console.log(profileUser, "inside req")
        setUserProfile(profileUser)
    }).catch((error) => {
        console.log(error.response.data)
    })
}


function setUserProfile(userObj){

    let profileAvatar = document.getElementById("profileAvatar")
    let profileUsername = document.getElementById("profileUsername")
    let profileName = document.getElementById("profileName")
    let profilePostsCount = document.getElementById("profilePostsCount")
    let profileCommentsCount = document.getElementById("profileCommentsCount")
    let userPosts = document.getElementById("userPosts")

    //console.log(userObj)

    profileAvatar.src = "./profile_pics/default_user.png"
    if (typeof userObj.profile_image == "string" && userObj.profile_image != null){
        profileAvatar.src = userObj.profile_image
    }
    profileUsername.innerHTML = userObj.username 
    profileName.innerHTML = userObj.name 
    profilePostsCount.innerHTML = userObj.posts_count
    profileCommentsCount.innerHTML = userObj.comments_count

    // get user's posts



    axios.get(`${baseUrl}/users/${userObj.id}/posts`)
    .then((response) => {
        let posts = response.data.data
        let image = "./images/default_post.jpg"
        let title = ""
        userPosts.innerHTML = ""

        for (let i=0; i<posts.length; i++){
            let post = posts[i]
            if (typeof post.image == "string"){
                image = post.image
            }

            if (post.title != null){
                title = post.title
            }


            
            let postHTML = 
            `
            <div class="col-12 col-md-4 post-preview-container" id="${post.id}" onmouseover="showPreviewContent(${post.id})" onmouseout="hidePreviewContent(${post.id})">
                <a href="postDetails.html?id=${post.id}">
                    <img src="${image}" class="d-block " alt="..." style="cursor: pointer; object-fit: contain; width: 100%">
                    <div class="post-content-preview" id="preview-content-${post.id}">
                        <h5 class="post-content-preview-title">
                        ${title}
                        <h5>
                        <p class="post-content-preview-body" style="font-size: 16px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; ">
                        ${post.body}
                        </p>
                    </div>
                </a>
            </div>
            `

            userPosts.innerHTML += postHTML

        }

    }).catch((error) => {
        let errorMsg = error.response.data.message
        showAlert(errorMsg, "danger")
    })

}

function showPreviewContent(id){
    let preview = document.getElementById(`preview-content-${id}`)
    preview.style.visibility = "visible"
}

function hidePreviewContent(id){
    let preview = document.getElementById(`preview-content-${id}`)
    preview.style.visibility = "hidden"
}