import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export default atom({
    key: 'User',
    default: {
        token: "",
        googleName: "",
        googleId: "",
        profilePicture: "",
    },
    effects_UNSTABLE: [persistAtom],
})