import request from "@/http";
export function getKeyPoints(img_b64_str: string) {
  return request.post<string>('ceph_keypoints',{
    img_b64_str,
  },
  {
    headers: {
      "Content-Type": 'application/json'
    }
  }
  )
}