
var baseUrl = "https://tarmeezacademy.com/api/v1"
let token = localStorage.getItem("token_Aligram")
let user = getCurrUser()


function setUI(){
    token = localStorage.getItem("token_Aligram")
    const user = JSON.parse(localStorage.getItem("user_Aligram"))

    const userToolbar = document.getElementById("userUI-toolbar")
    const guestToolbar = document.getElementById("guestUI-toolbar")
    const addPostTrigger = document.getElementById("add-post-trigger")
    const addCommentDiv = document.getElementById("addCommentDiv")
    const profileLink = document.getElementById("profileLink")
    let avatar = "./profile_pics/default_user.png"
    
    
    if (token == null){
        userToolbar.classList.add("d-none")
        guestToolbar.classList.remove("d-none")
        profileLink.classList.add("d-none")
        if (addPostTrigger != null){
            addPostTrigger.classList.add("d-none")
        }

        if (addCommentDiv != null){
            addCommentDiv.innerHTML = ""
        }
        
    } else {
        userToolbar.classList.remove("d-none")
        guestToolbar.classList.add("d-none")
        profileLink.classList.remove("d-none")
        if (addPostTrigger != null){
            addPostTrigger.classList.remove("d-none")
        }
        

        if (user != null){
            if (user.profile_image != null && typeof user.profile_image == "string" ){
                // avatar = baseUrl + user.profile_image.substring(16)
                avatar = user.profile_image
            }
            document.getElementById("profile-toggle-username").innerText = user.username
            document.getElementById("profile-toggle-avatar").setAttribute("src", avatar)

            if (addCommentDiv != null){
                
                addCommentDiv.innerHTML = 
                `
                <div class="input-group mb-3">
                    <input type="text" id="comment-input" class="form-control" placeholder="Leave a comment..." aria-label="Recipient's username" aria-describedby="button-addon2">
                    <button class="btn btn-outline-secondary" type="button" id="add-comment-btn" onclick="addCommentBtnClicked()">Send</button>
                </div>
                `
            
            }
        }
    }

    if (window.location == "index.html"){
        getPosts()
    }
    
}

function getPosts(page = 1){
    toggleLoader(true, "posts")
    axios.get(baseUrl + `/posts?limit=5&page=${page}`)
    .then((response) => {
        

        if (page == 1){
            document.getElementById("posts").innerHTML = ""
        }
        
        lastPage = response.data.meta.last_page
        let posts = response.data.data
        // console.log(posts)


        for (let i = 0; i < posts.length; i++){
            let post = posts[i]

            let post_image = "./images/default_post.jpg"
            let avatar = "./profile_pics/default_user.png"
            let postTitle = ""

            if (typeof post.title == "string" && post.title != null){
                postTitle = post.title
            }

            if (typeof post.image == "string" && post.image != null){
                post_image = post.image
            }
            
            if (typeof post.author.profile_image == "string" && post.author.profile_image != null){
                avatar = post.author.profile_image
            }
            
            //check whether to show edit button
            user = getCurrUser()
            let toolbar = ""
            if (user != null && post.author.id == user.id){
                toolbar = 
                `
                <span class="float-end">
                    <button class="btn btn-danger rounded-circle " style="height:40px; width: 40px; display: inline-flex; justify-content: center;" onclick="deletePostToggle(${post.id})" >
                        <span class="material-symbols-outlined">
                            delete
                        </span>
                    </button>
                    <button class="btn btn-secondary rounded-circle" style="height:40px; width: 40px; display: inline-flex; justify-content: center;" onclick="EditPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" >
                        <span class="material-symbols-outlined" style="font-size: 23px">
                            edit_square
                        </span>
                    </button>
                </span>
                
                `
            }


            let tagsHTML = ""

            for (let j = 0; j < post.tags.length; j++){
                tagsHTML += `<span class="badge rounded-pill text-bg-secondary mx-1">${post.tags[j].name}</span>`
            }

            let postHTML = `

                <div class="post mb-3" >
                    <div class="card shadow">
                        <h5 class="card-header">
                            <a href="userProfile.html?id=${post.author.id}" style="text-decoration: none; color: black">
                                <img class="img-thumbnail rounded-circle" style="width: 40px; height: 40px" src="${avatar}" alt="user">
                                <b>@${post.author.username}</b>
                            </a>
                            ${toolbar}
                        </h5>
                        <div class="card-body" style="cursor: pointer;" onclick="showPostDetails(${post.id})">
                            <img id="post-img" class="w-100" src="${post_image}" alt="post">
                            <h6 class="text-muted">${post.created_at}</h6>
                            <h5 class="card-title">${postTitle}</h5>
                            <p class="card-text">${post.body}</p>
                            <hr>
                            
                            <a href="#" class="text-black" style="text-decoration: none;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vector-pen" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                                    <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z"/>
                                </svg>
                                (${post.comments_count}) comments
                            </a>
            `
            +
            
            tagsHTML 
            
            + `
                        </div>
                    </div>
                </div>
            `
            
            document.getElementById("posts").innerHTML += postHTML
        }
    })
    .catch((error) => {
        alert(error)
    }).finally(() => {
        toggleLoader(false, "posts")
    })

}

function getPost(){
    toggleLoader(true)
    axios.get(baseUrl + `/posts/${id}`)
    .then((response) => {
        let post = response.data.data
        // console.log(post)

        // console.log(document.getElementById("authorUsername"))
        document.getElementById("authorUsername").innerHTML = post.author.username
        let title = ""
        let avatar = "./profile_pics/default_user.png"

        if (typeof post.author.profile_image == "string" && post.author.profile_image != null){
            avatar = post.author.profile_image
        }

        if (post.title != null){
            title = post.title
        }

        let comments = ""

        for (i = 0; i<post.comments.length; i++){
            let comment = post.comments[i]
            let commentAvatar = "./profile_pics/default_user.png"
            // console.log(comment)

            if (typeof comment.author.profile_image == "string" &&  comment.author.profile_image != null){
                commentAvatar = comment.author.profile_image
            }
            let commentHTML = 
            `
            
            <div class="comment p-3" style="border-top: 1px solid #C7BCA1;">
                
                <div class="mb-2">
                    <img src="${commentAvatar}" alt="" class="rounded-circle" style="height: 40px; width: 40px;">
                    <b>@${comment.author.username}</b>
                </div>
                <div>
                    ${comment.body}
                </div>
            </div>
            `
            comments += commentHTML
        }

        // console.log(avatar)

        let postDetailsHTML = 
        `
            <div class="card">
                <h5 class="card-header">
                    <img class="img-thumbnail rounded-circle" style="width: 40px; height: 40px" src="${avatar}" alt="default_user">
                    <b>@${post.author.username}</b>
                    <span class="float-end">
                        <button class="btn btn-danger rounded-circle " style="height:40px; width: 40px; display: inline-flex; justify-content: center;" onclick="deletePostToggle(${post.id})" >
                            <span class="material-symbols-outlined">
                                delete
                            </span>
                        </button>
                        <button class="btn btn-secondary rounded-circle" style="height:40px; width: 40px; display: inline-flex; justify-content: center;" onclick="EditPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')" >
                            <span class="material-symbols-outlined" style="font-size: 23px">
                                edit_square
                            </span>
                        </button>
                    </span>
                </h5>
                <div class="card-body">
                    <img id="post-img" class="w-100" src="${post.image}" alt="post">
                    <h6 class="text-muted">${post.created_at}</h6>
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${post.body}</p>
                    <hr>
                    
                    <a href="#" class="text-black" style="text-decoration: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-vector-pen" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M10.646.646a.5.5 0 0 1 .708 0l4 4a.5.5 0 0 1 0 .708l-1.902 1.902-.829 3.313a1.5 1.5 0 0 1-1.024 1.073L1.254 14.746 4.358 4.4A1.5 1.5 0 0 1 5.43 3.377l3.313-.828L10.646.646zm-1.8 2.908-3.173.793a.5.5 0 0 0-.358.342l-2.57 8.565 8.567-2.57a.5.5 0 0 0 .34-.357l.794-3.174-3.6-3.6z"/>
                            <path fill-rule="evenodd" d="M2.832 13.228 8 9a1 1 0 1 0-1-1l-4.228 5.168-.026.086.086-.026z"/>
                        </svg>
                        (${post.comments_count}) comments
                    </a>
                </div>

                <div id="comments" class="ms-2 mt-2">
                    ${comments}
                </div>
            </div>
        
        `

        
        document.getElementById("post").innerHTML = postDetailsHTML

        
    
    }).catch((error) => {
        let errorMsg = error.response.data.message
        showAlert(errorMsg, "danger")
    }).finally(() => {
        toggleLoader(false)
    })

}

function registerBtnClicked(){
    toggleLoader(true)
    const name = document.getElementById("register-name-input").value
    const username = document.getElementById("register-username-input").value
    const password = document.getElementById("register-password-input").value
    const avatar = document.getElementById("register-avatar-input").files[0]

    // console.log(avatar)

    const formData = new FormData()
    formData.append("name", name)
    formData.append("username", username)
    formData.append("password", password)
    formData.append("image", avatar)

    let headers = {
        "content-type": "multipart/form-data",
    }
    // console.log(formData)

    axios.post(`${baseUrl}/register`, formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    .then((response) => {
        // console.log(response.data)
        const token = response.data.token
        const user = response.data.user

        localStorage.setItem("token_Aligram", token)
        localStorage.setItem("user_Aligram", JSON.stringify(user))

        const registerModalEl = document.getElementById("registerModal")
        const registerModal = bootstrap.Modal.getInstance(registerModalEl)
        registerModal.hide()

        setUI()
        showAlert("Registered successfully!", "success")
    })
    .catch((error) => {
        if (error){
            let errorMsg = error.response.data.message ?? ""
            showAlert(errorMsg, "danger")
        }
    }).finally(() => {
        toggleLoader(false)
    })
}

function loginBtnClicked(){

    toggleLoader(true)
    const username = document.getElementById("username-input").value 
    const password = document.getElementById("password-input").value 

    const params = {
        username: username,
        password: password
    }

    axios.post(baseUrl + "/login", params)
    .then((response) => {
        
        
        const token = response.data.token

        localStorage.setItem("token_Aligram", token)
        localStorage.setItem("user_Aligram", JSON.stringify(response.data.user))


        closeModal("loginModal")

        setUI()
        showAlert("Logged in successfully! ", "success")
       
    })
    .catch((error) => {

        showAlert(error.response.data.message, "danger")

    }).finally(() => {
        toggleLoader(false)
    })



}

function showAlert(message, type = "success")
{
    // create a placeholder element for the alert
    const alertDiv = document.createElement("div")
    const alertDivID = `${type}-alert`
    alertDiv.setAttribute("id", alertDivID)
    alertDiv.style = "position: fixed; bottom: 30px; right: 15px; width: 30vw; height: 40px; z-index: 999999;"
    if (window.innerWidth < 600){
        alertDiv.style = "position: fixed; top: 30px; right: 15px; width: 60vw; height: 40px; z-index: 999999;"
    }
    alertDiv.classList.add("fade")
    alertDiv.classList.add("show")

    document.body.append(alertDiv)

    // display the alert
    const alertPlaceholder = document.getElementById(alertDivID)

    const alert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('')

    alertPlaceholder.append(wrapper)
    }

    alert(message, type)

    // hide the alert
    setTimeout(() => {
        const alert = bootstrap.Alert.getOrCreateInstance(`#${alertDivID}`)
        alert.close()
    }, 3000)
}

function logout(){
    localStorage.removeItem("token_Aligram")
    localStorage.removeItem("user_Aligram")
    setUI()
    showAlert("Logged out successfully!", "danger")
}

function closeModal(id){
    const modalEl = document.getElementById(id)
    const modal = bootstrap.Modal.getInstance(modalEl)
    modal.hide()
}

function EditPostBtnClicked(post){
    adjustPostModal("edit")
    
    post = JSON.parse(decodeURIComponent(post))
    document.getElementById("postId").value = post.id
    const title = document.getElementById("post-title-input")
    const body = document.getElementById("post-body-input")
    title.value = post.title
    body.value = post.body
    
    let modal = new bootstrap.Modal(document.getElementById("addPostModal"), {})
    modal.toggle()
}

function addPostBtnClicked(){
    
    toggleLoader(true)
    const postId = document.getElementById("postId").value
    let searchParams = new URLSearchParams(window.location.search)
    let postIdSearch = searchParams.get("id")
    
    
    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const file = document.getElementById("post-file-input").files[0]
    const token = localStorage.getItem("token_Aligram")
    
    let params = new FormData()
    params.append("title", title)
    params.append("body", body)
    params.append("image", file)

    let headers = {
        "authorization": `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
    }

    let url = ""
    let successMsg = ""
    let reload = () => {
        getPost()
    }
    if (postId == "" || postId == null){
        url = `${baseUrl}/posts`
        successMsg = "Post Created Successfully! "

        if (postIdSearch == null){
            reload = () => {
                getPosts()
            }
        }
        

    } else {

        params.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
        successMsg = "Post Edited Successfully! "

        
        
        if (postIdSearch == null){
            reload = () => {
                getPosts()
            }
        }
        
    }

    axios.post(url, params, {
        "headers": headers
    }).then((response) => {
        response = response.data.data
        closeModal("addPostModal")

        showAlert(successMsg)

        document.getElementById("post-title-input").value = ""
        document.getElementById("post-body-input").value = ""

        reload()

    }).catch((error) => {
        
        errorMsg = error.response.data.massege
        showAlert(errorMsg, "danger")
        
    }).finally(() => {
        toggleLoader(false)
    })
    
}

function addPostTrigger(){
    adjustPostModal("add")
    document.getElementById("postId").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("addPostModal"), {})
    postModal.toggle()
}

function adjustPostModal(typeOfModal){
    let title = document.getElementById("postModalTitle")
    let submitBtn = document.getElementById("addPostBtn")
    const postTitle = document.getElementById("post-title-input")
    const postBody = document.getElementById("post-body-input")
    if (typeOfModal == "add"){
        // adjust the content of the modal 
        title.innerHTML = "Add a new Post"
        submitBtn.innerHTML = "Post"
        postTitle.value = ""
        postBody.value = ""

    } else if (typeOfModal == "edit") {
        // adjust the content of the modal
        title.innerHTML = "Edit Post"
        submitBtn.innerHTML = "Edit"
    }
}

function getCurrUser(){
    let user = null
    let storageUser = localStorage.getItem("user_Aligram")

    if (storageUser != null){
        user = JSON.parse(storageUser)
    }

    return user
}

function deletePostBtnClicked(){
    toggleLoader(true)
    let postId = document.getElementById("post-id-delete").value
    
    axios.delete(`${baseUrl}/posts/${postId}`, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })
    .then((response) => {
        //console.log(response.data.data)
        closeModal("deletePostModal")
        showAlert("Post Deleted Successfully!", "success")
        if (window.location == "index.html"){
            getPosts()
        }else {
            window.location = "index.html"
        }
        
    }).catch((error) => {
        showAlert(error.response.data.message, "danger")
    }).finally(() => {
        toggleLoader(false)
    })
}

function deletePostToggle(postId){
    document.getElementById("post-id-delete").value = postId
    let deleteModal = new bootstrap.Modal(document.getElementById("deletePostModal"), {})
    deleteModal.toggle()
}

function toggleLoader(show, type="")
{
    if (show){
        document.getElementById(`${type}Loader`).classList.remove("d-none")
    } else {
        document.getElementById(`${type}Loader`).classList.add("d-none")
    }
}