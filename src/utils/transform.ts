export class Transform {
  s: any
  r: any
  tx: any
  ty: any
  EPSILON = 0.0000000001
  constructor(s: any, r: any, tx: any, ty: any) {
    // Public, to allow user access
    this.s = s
    this.r = r
    this.tx = tx
    this.ty = ty
  }
  init(s: any, r: any, tx: any, ty: any) {
    // Public, to allow user access
    this.s = s
    this.r = r
    this.tx = tx
    this.ty = ty
    return this
  }
  almostEquals(t: { s: number; r: number; tx: number; ty: number }, epsilon: number){ 
    if (typeof epsilon !== 'number') {
      epsilon = this.EPSILON
    }

    const ds = Math.abs(this.s - t.s)
    const dr = Math.abs(this.r - t.r)
    const dx = Math.abs(this.tx - t.tx)
    const dy = Math.abs(this.ty - t.ty)

    // smaller-or-equal instead of smaller-than to make epsilon=0 work.
    return ds + dr + dx + dy <= epsilon
  }
  almostEqual(t: { s: number; r: number; tx: number; ty: number }, epsilon: number){ 
    if (typeof epsilon !== 'number') {
      epsilon = this.EPSILON
    }

    const ds = Math.abs(this.s - t.s)
    const dr = Math.abs(this.r - t.r)
    const dx = Math.abs(this.tx - t.tx)
    const dy = Math.abs(this.ty - t.ty)

    // smaller-or-equal instead of smaller-than to make epsilon=0 work.
    return ds + dr + dx + dy <= epsilon
  }
  equals(t: { s: number; r: number; tx: number; ty: number }) {
    // Are transforms equal?
    //
    // Parameters:
    //   t
    //     Transform
    //
    return (
        this.s === t.s && this.r === t.r && this.tx === t.tx && this.ty === t.ty
    )
  }
  getMatrix() {
    return {
        a: this.s,
        b: this.r,
        c: -this.r,
        d: this.s,
        e: this.tx,
        f: this.ty,
    }
  }
  getRotation() {
    // in rads
    return Math.atan2(this.r, this.s)
  }
  
  getScale() {
    // scale multiplier
    return Math.sqrt(this.r * this.r + this.s * this.s)
  }
  
  getTranslation() {
    // Current translation as a point.
    return [this.tx, this.ty]
  }
  
  toArray() {
    // Return an array representation of the transformation.
    //
    // Together with nudged.createFromArray(...), this method makes an easy
    // serialization and deserialization to and from JSON possible.
    return [this.s, this.r, this.tx, this.ty]
  }
  
  // Methods that return new points
  
  transform(p: any[]) {
    // p
    //   point [x, y] or array of points [[x1,y1], [x2, y2], ...]
  
    if (typeof p[0] === 'number') {
        // Single point
        return [
            this.s * p[0] - this.r * p[1] + this.tx,
            this.r * p[0] + this.s * p[1] + this.ty,
        ]
    } // else
  
    let i;
    const c = []
    for (i = 0; i < p.length; i += 1) {
        c.push([
            this.s * p[i][0] - this.r * p[i][1] + this.tx,
            this.r * p[i][0] + this.s * p[i][1] + this.ty,
        ])
    }
    return c
  }
  
  // Methods that return new Transformations
  
  inverse() {
    const det = this.s * this.s + this.r * this.r
    if (Math.abs(det) < this.EPSILON) {
        throw new Error('Singular transformations cannot be inversed.')
    }
    const shat = this.s / det
    const rhat = -this.r / det
    const txhat = (-this.s * this.tx - this.r * this.ty) / det
    const tyhat = (this.r * this.tx - this.s * this.ty) / det
  
    return new Transform(shat, rhat, txhat, tyhat)
  }
  
  translateBy(dx: number, dy: number) {
    return new Transform(this.s, this.r, this.tx + dx, this.ty + dy)
  }
  
  scaleBy(multiplier: any, pivot: any[]) {
    // Parameter
    //   multiplier
    //   pivot
    //     optional, a [x, y] point
    let x, y;
    const m = multiplier // alias
    if (typeof pivot === 'undefined') {
        x = y = 0
    } else {
        x = pivot[0]
        y = pivot[1]
    }
    return new Transform(
        m * this.s,
        m * this.r,
        m * this.tx + (1 - m) * x,
        m * this.ty + (1 - m) * y
    )
  }
  
  rotateBy(radians: number, pivot: any[]) {
    // Parameter
    //   radians
    //     from positive x to positive y axis
    //   pivot
    //     optional, a [x, y] point
    //
    let  x, y
    const co = Math.cos(radians)
    const si = Math.sin(radians)
    if (typeof pivot === 'undefined') {
        x = y = 0
    } else {
        x = pivot[0]
        y = pivot[1]
    }
    const shat = this.s * co - this.r * si
    const rhat = this.s * si + this.r * co
    const txhat = (this.tx - x) * co - (this.ty - y) * si + x
    const tyhat = (this.tx - x) * si + (this.ty - y) * co + y
  
    return new Transform(shat, rhat, txhat, tyhat)
  }
  
  multiplyBy(transform: any) {
    // Multiply this transformation matrix A
    // from the right with the given transformation matrix B
    // and return the result AB
  
    // For reading aid:
    // s -r tx  t.s -r tx
    // r  s ty *  r  s ty
    // 0  0  1    0  0  1
    const t = transform // alias
    const shat = this.s * t.s - this.r * t.r
    const rhat = this.s * t.r + this.r * t.s
    const txhat = this.s * t.tx - this.r * t.ty + this.tx
    const tyhat = this.r * t.tx + this.s * t.ty + this.ty
  
    return new Transform(shat, rhat, txhat, tyhat)
  }
}

// const = Transform.prototype

// proto.init = function (s, r, tx, ty) {
//   // Public, to allow user access
//   this.s = s
//   this.r = r
//   this.tx = tx
//   this.ty = ty
//   return this
// }

// proto.almostEquals = proto.almostEqual = function (t, epsilon) {
//   // Are transforms almost equal? Return true if a matrix norm
//   // of the difference is smaller than epsilon. We use modified L1 norm
//   // that values s, r, tx, and ty as equally important.
//   //
//   // Parameters:
//   //   t
//   //     Transform
//   //   epsilon
//   //     optional number, default to Transform.EPSILON.
//   //     Set to 0 for strict comparison.
//   //
//   // Note:
//   //   We first thought to use Frobenius norm but it felt wrong
//   //   because it exaggerates s and r. Proof:
//   //     We know Frobenius norm for real square matrices:
//   //       Norm(A) = sqrt(sum_i(sum_j(a_ij * a_ij)))
//   //     For a transform it looks like:
//   //       Norm(T) = sqrt(s*s + r*r + x*x + r*r + s*s + y*y + 1)
//   //     Thus s and r have bigger impact.
//   //
//   if (typeof epsilon !== 'number') {
//       epsilon = Transform.EPSILON
//   }

//   const ds = Math.abs(this.s - t.s)
//   const dr = Math.abs(this.r - t.r)
//   const dx = Math.abs(this.tx - t.tx)
//   const dy = Math.abs(this.ty - t.ty)

//   // smaller-or-equal instead of smaller-than to make epsilon=0 work.
//   return ds + dr + dx + dy <= epsilon
// }

// proto.equal = proto.equals = function (t) {
//   // Are transforms equal?
//   //
//   // Parameters:
//   //   t
//   //     Transform
//   //
//   return (
//       this.s === t.s && this.r === t.r && this.tx === t.tx && this.ty === t.ty
//   )
// }

// proto.getMatrix = function () {
//   // Get the transformation matrix in the format common to
//   // many APIs, including:
//   // - kld-affine
//   //
//   // Return
//   //   object o, having properties a, b, c, d, e, f:
//   //   [ s  -r  tx ]   [ o.a  o.c  o.e ]
//   //   [ r   s  ty ] = [ o.b  o.d  o.f ]
//   //   [ 0   0   1 ]   [  -    -    -  ]
//   return {
//       a: this.s,
//       b: this.r,
//       c: -this.r,
//       d: this.s,
//       e: this.tx,
//       f: this.ty,
//   }
// }

// proto.getRotation = function () {
//   // in rads
//   return Math.atan2(this.r, this.s)
// }

// proto.getScale = function () {
//   // scale multiplier
//   return Math.sqrt(this.r * this.r + this.s * this.s)
// }

// proto.getTranslation = function () {
//   // Current translation as a point.
//   return [this.tx, this.ty]
// }

// proto.toArray = function () {
//   // Return an array representation of the transformation.
//   //
//   // Together with nudged.createFromArray(...), this method makes an easy
//   // serialization and deserialization to and from JSON possible.
//   return [this.s, this.r, this.tx, this.ty]
// }

// // Methods that return new points

// proto.transform = function (p) {
//   // p
//   //   point [x, y] or array of points [[x1,y1], [x2, y2], ...]

//   if (typeof p[0] === 'number') {
//       // Single point
//       return [
//           this.s * p[0] - this.r * p[1] + this.tx,
//           this.r * p[0] + this.s * p[1] + this.ty,
//       ]
//   } // else

//   var i
//   var c = []
//   for (i = 0; i < p.length; i += 1) {
//       c.push([
//           this.s * p[i][0] - this.r * p[i][1] + this.tx,
//           this.r * p[i][0] + this.s * p[i][1] + this.ty,
//       ])
//   }
//   return c
// }

// // Methods that return new Transformations

// proto.inverse = function () {
//   var det = this.s * this.s + this.r * this.r
//   if (Math.abs(det) < Transform.EPSILON) {
//       throw new Error('Singular transformations cannot be inversed.')
//   }
//   var shat = this.s / det
//   var rhat = -this.r / det
//   var txhat = (-this.s * this.tx - this.r * this.ty) / det
//   var tyhat = (this.r * this.tx - this.s * this.ty) / det

//   return new Transform(shat, rhat, txhat, tyhat)
// }

// proto.translateBy = function (dx, dy) {
//   return new Transform(this.s, this.r, this.tx + dx, this.ty + dy)
// }

// proto.scaleBy = function (multiplier, pivot) {
//   // Parameter
//   //   multiplier
//   //   pivot
//   //     optional, a [x, y] point
//   var m, x, y
//   m = multiplier // alias
//   if (typeof pivot === 'undefined') {
//       x = y = 0
//   } else {
//       x = pivot[0]
//       y = pivot[1]
//   }
//   return new Transform(
//       m * this.s,
//       m * this.r,
//       m * this.tx + (1 - m) * x,
//       m * this.ty + (1 - m) * y
//   )
// }

// proto.rotateBy = function (radians, pivot) {
//   // Parameter
//   //   radians
//   //     from positive x to positive y axis
//   //   pivot
//   //     optional, a [x, y] point
//   //
//   var co, si, x, y, shat, rhat, txhat, tyhat
//   co = Math.cos(radians)
//   si = Math.sin(radians)
//   if (typeof pivot === 'undefined') {
//       x = y = 0
//   } else {
//       x = pivot[0]
//       y = pivot[1]
//   }
//   shat = this.s * co - this.r * si
//   rhat = this.s * si + this.r * co
//   txhat = (this.tx - x) * co - (this.ty - y) * si + x
//   tyhat = (this.tx - x) * si + (this.ty - y) * co + y

//   return new Transform(shat, rhat, txhat, tyhat)
// }

// proto.multiplyRight = proto.multiplyBy = function (transform) {
//   // Multiply this transformation matrix A
//   // from the right with the given transformation matrix B
//   // and return the result AB

//   // For reading aid:
//   // s -r tx  t.s -r tx
//   // r  s ty *  r  s ty
//   // 0  0  1    0  0  1
//   var t = transform // alias
//   var shat = this.s * t.s - this.r * t.r
//   var rhat = this.s * t.r + this.r * t.s
//   var txhat = this.s * t.tx - this.r * t.ty + this.tx
//   var tyhat = this.r * t.tx + this.s * t.ty + this.ty

//   return new Transform(shat, rhat, txhat, tyhat)
// }

// Transform.IDENTITY = new Transform(1, 0, 0, 0)
// Transform.R90 = new Transform(0, 1, 0, 0)
// Transform.R180 = new Transform(-1, 0, 0, 0)
// Transform.R270 = new Transform(0, -1, 0, 0)
// Transform.X2 = new Transform(2, 0, 0, 0)