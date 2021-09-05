export default abstract class BulletPattern {

    abstract preload();
    abstract create();
    abstract reset();
    abstract update(dt);    
    abstract finished();

}