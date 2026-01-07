//The worst file in th world of programming because Developer creates it to put all kind of functions in the same file
//you should avoid to add utils file because it is bad practice
//The files should have meanings and comprehension to add them in the project

export function random(len: number) {
    let options = "abcdefghijklmnopqrstuvwxyz1234567890"
    const length = options.length

    let ans = ""

    for(let i=0; i < len; i++) {
        ans += options[Math.floor(Math.random() * length)]
    }
    return ans
}