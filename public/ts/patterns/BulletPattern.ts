export default abstract class BulletPattern {

    abstract preload();
    abstract create();
    abstract fontload();
    abstract reset();
    abstract update(dt: number);    
    abstract finished();
    

}