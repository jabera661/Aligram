

let currPage = 1
let lastPage = 1

setUI()
getPosts()

// ==========Infinite scrolling==========
window.addEventListener("scroll", ()=> {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight){
        if (currPage < lastPage){
            // console.log("eof", currPage, lastPage)
            currPage++
            getPosts(currPage)
            // console.log("currPage updated")
        }
        
    }
})

// //=========infinite scrollin=========//









function showPostDetails(id){
    toggleLoader(true)
    window.location = `./postDetails.html?id=${id}`
}

